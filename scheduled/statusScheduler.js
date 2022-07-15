const CronJob = require("node-cron");
const moment = require("moment");
const Reservation = require("../models/").reservation;
const User = require("../models/").user;
const Transaction = require("../models/").transaction;
const { sequelize } = require("../models/");
const { Op } = require("sequelize");
const {
  REV_STATUS_CREATED,
  REV_STATUS_ACCEPTED,
  REV_STATUS_CANCELLED,
  REV_STATUS_COMPLETED,
  REV_STATUS_EXPIRED,
} = require("../config/constants");

//TODO re-use from reservations??
const calculateCredits = (startDate, endDate) => {
  if (!startDate || !endDate) {
    return 0;
  }

  const sDate = new Date(startDate);
  console.log("start date is changes in date format", sDate);
  const eDate = new Date(endDate);

  const diffTime = eDate - sDate;
  if (diffTime < 0) {
    return 0;
  }

  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  console.log(eDate, "-", sDate, "=", diffDays);
  return diffDays + 1;
};

const setReservationExpire = async (reservation) => {
  const t = await sequelize.transaction();

  try {
    await Reservation.update(
      // update 2 fields at the same time
      { status: REV_STATUS_EXPIRED },
      { where: { id: reservation.id } },
      { transaction: t }
    );

    const requestUserId = reservation.requesterUserId;
    const unblock = calculateCredits(
      reservation.startDate,
      reservation.endDate
    );

    await User.decrement(
      "blockedCredits",
      {
        by: unblock,
        where: { id: requestUserId },
      },
      { transaction: t }
    );
    await t.commit();
  } catch (error) {
    console.log(error);
    await t.rollback();
  }
};

const setReservatioComplete = async (reservation) => {
  const t = await sequelize.transaction();
  try {
    await Reservation.update(
      // update 2 fields at the same time
      { status: REV_STATUS_COMPLETED },
      { where: { id: reservation.id } },
      { transaction: t }
    );

    const requestUserId = reservation.requesterUserId;
    const unblock = calculateCredits(
      reservation.startDate,
      reservation.endDate
    );
    console.log("Will do change of " + unblock + " to id " + reservation.id);
    //TODO re-use logic from reservations route??
    await User.decrement(
      "blockedCredits",
      {
        by: unblock,
        where: { id: requestUserId },
      },
      { transaction: t }
    );
    await User.decrement(
      "credits",
      {
        by: unblock,
        where: { id: requestUserId },
      },
      { transaction: t }
    );
    await User.increment(
      "credits",
      {
        by: unblock,
        where: { id: reservation.providerUserId },
      },
      { transaction: t }
    );
    await Transaction.create(
      {
        reservationId: reservation.id,
        reason: `AUTO Approve: user-${reservation.requesterUserId} to user-${reservation.providerUserId}`,
        creditsChange: unblock,
      },
      { transaction: t }
    );
    await t.commit();
  } catch (error) {
    console.log(error);
    await t.rollback();
  }
};

const updateExpiredReservations = async () => {
  try {
    console.log("Updating status of expired reservations");
    const reservations = await Reservation.findAll({
      where: {
        [Op.and]: [
          {
            status: {
              [Op.eq]: REV_STATUS_CREATED,
            },
          },
          {
            startDate: {
              [Op.lte]: new Date(),
            },
          },
        ],
      },
    });

    reservations.forEach((r) => {
      console.log("We will expire status of " + r.id);
      setReservationExpire(r);
    });
  } catch (error) {
    console.log("updateExpiredReservations failed", error);
  }
};

const updateCompletedReservations = async () => {
  try {
    console.log("Updating status of completed reservations");
    const twoDaysBefore = new Date();
    twoDaysBefore.setDate(twoDaysBefore.getDate() - 2);
    const reservations = await Reservation.findAll({
      where: {
        [Op.and]: [
          {
            status: {
              [Op.eq]: REV_STATUS_ACCEPTED,
            },
          },
          {
            endDate: {
              [Op.lte]: twoDaysBefore,
            },
          },
        ],
      },
    });

    reservations.forEach((r) => {
      console.log("We will update status of " + r.id);
      setReservatioComplete(r);
    });
  } catch (error) {
    console.log("updateCompletedReservations failed", error);
  }
};

//for frequancy, see  https://crontab.cronhub.io/
exports.initScheduledJobs = () => {
  // every minute. if you need quik test, use this one
  const statusScheduler = CronJob.schedule("* * * * *", () => {
    // everyday at 21:00
    // const statusScheduler = CronJob.schedule("0 21 * * *", () => {
    updateCompletedReservations();
    updateExpiredReservations();
  });
  console.log("Scheduler scheduled.");
  statusScheduler.start();
};

const { Router } = require("express");
const router = new Router();
const User = require("../models/").user;
const Reservation = require("../models/").reservation;
const Transaction = require("../models").transaction;
const authMiddleware = require("../auth/middleware");
const { Op } = require("sequelize");

const {
  REV_STATUS_CREATED,
  REV_STATUS_ACCEPTED,
  REV_STATUS_CANCELLED,
  REV_STATUS_COMPLETED,
} = require("../config/constants");

// CALCULATE CREDITS
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

//GET ALL REZ.

router.get("/", async (req, res, next) => {
  try {
    const reservations = await Reservation.findAll({
      // include: [User, Transaction],
      include: [
        { model: User, association: "requester" },
        { model: User, association: "provider" },
      ],
      where: {
        status: REV_STATUS_CREATED,
      },
    });
    res.send(reservations);
  } catch (e) {
    console.log(e.message);
    next(e);
  }
});

// GET MY REZ.

router.get("/mine", authMiddleware, async (req, res, next) => {
  console.log("In mine reservations");
  const user = req.user;
  console.log("requester ", user);

  if (!user) {
    return res.status(401).send("You need to login");
  }

  const requesterUserId = user.id;
  console.log("requester id ", requesterUserId);

  try {
    const reservations = await Reservation.findAll({
      // include: [User, Transaction],
      include: [
        { model: User, association: "requester" },
        { model: User, association: "provider" },
      ],
      //get the reservations that belong to this user as provider or requester
      where: {
        [Op.or]: [
          {
            requesterUserId: {
              [Op.eq]: requesterUserId,
            },
          },
          {
            providerUserId: {
              [Op.eq]: requesterUserId,
            },
          },
        ],
      },
    });
    res.send(reservations);
  } catch (e) {
    console.log(e.message);
    next(e);
  }
});

// GET REZ. DETAILS

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findByPk(id, {
      include: [
        { model: User, as: "requester" },
        { model: User, as: "provider" },
        Transaction,
      ],
    });
    res.send(reservation);
  } catch (e) {
    console.log(e.message);
    next(e);
  }
});

// NEW REZ. - POST
router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const user = req.user;
    console.log("requester ", user);

    if (!user) {
      return res.status(401).send("You need to login");
    }

    const requesterUserId = user.id;
    console.log("requester id ", requesterUserId);

    const { startDate, endDate, description, longitude, latitude, imageUrl } =
      req.body;
    if (!startDate || !endDate || !description || !imageUrl) {
      console.log(
        "Please provide a description, an image, a start and end date"
      );
      return res
        .status(400)
        .send("Please provide a description, an image, a start and end date");
    }
    if (!latitude || !longitude) {
      console.log("Please find your location on the map");
      return res.status(400).send("Please find your location on the map");
    }

    // CHECK TS
    const creditsNeeded = calculateCredits(startDate, endDate);
    const availableCredits = user.credits - user.blockedCredits;
    if (availableCredits < creditsNeeded) {
      console.log(
        `User tried to spend ${creditsNeeded} but has only ${availableCredits}.`
      );
      return res.status(400).send("Your credits are not enough.");
    } else {
      console.log(
        `User will  spend ${creditsNeeded} from ${availableCredits} credits.`
      );
    }

    const newReservation = {
      startDate,
      endDate,
      description,
      longitude,
      latitude,
      imageUrl,
      status: REV_STATUS_CREATED,
      requesterUserId,
    };

    //DB Transaction : Start here
    await User.increment("blockedCredits", {
      by: creditsNeeded,
      where: { id: requesterUserId },
    });
    const createdReservation = await Reservation.create(newReservation);
    // DB Transaction : End here

    const reservationWithData = await Reservation.findByPk(
      createdReservation.id,
      {
        include: [
          { model: User, as: "requester" },
          { model: User, as: "provider" },
          Transaction,
        ],
      }
    );

    console.log("new rez. object", reservationWithData);
    res.send(reservationWithData);
  } catch (e) {
    console.log("Error for new rez. :", e.message);
    next(e);
  }
});

// ACCEPT REZ.

router.post("/:id/accept", authMiddleware, async (req, res, next) => {
  try {
    const user = req.user;
    console.log("provider ", user);

    if (!user) {
      return res.status(401).send("You need to login");
    }

    const providerUserId = user.id;
    console.log("provider id ", providerUserId);

    const reservationId = req.params.id;
    console.log(reservationId, "this is reservationId ");
    const reservation = await Reservation.findByPk(reservationId);

    if (reservation.status !== REV_STATUS_CREATED) {
      return res.status(400).send("This reservation is already accepted");
    }
    // update reservation by accepting button
    await Reservation.update(
      // update 2 fields at the same time
      { providerUserId: providerUserId, status: REV_STATUS_ACCEPTED },
      { where: { id: reservationId } }
    );
    //find updated reservation
    const updatedReservation = await Reservation.findByPk(reservationId, {
      include: [
        { model: User, as: "requester" },
        { model: User, as: "provider" },
        Transaction,
      ],
    });
    console.log("Accept reservation returns", updatedReservation);
    res.send(updatedReservation);
  } catch (e) {
    console.log(e.message);
    next(e);
  }
});

// CANCEL REZ.
router.post("/:id/cancel", authMiddleware, async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).send("You need to login");
    }

    const userId = user.id;
    // const requesterUserId = user.id;

    const reservationId = req.params.id;
    const reservation = await Reservation.findByPk(reservationId);

    if (
      reservation.providerUserId !== userId &&
      reservation.requesterUserId !== userId
    ) {
      return res.status(403).send("You are not authorized.");
    }
    const isRequesterCancelling = reservation.requesterUserId === userId;
    console.log(
      userId,
      "is cancelling",
      reservationId,
      " and is owner:",
      isRequesterCancelling ? "yes" : "no"
    );
    if (
      reservation.status === REV_STATUS_ACCEPTED ||
      (isRequesterCancelling && reservation.status == REV_STATUS_CREATED)
    ) {
      //DB Transaction : Start here
      // update reservation by cancel button
      const rowsEffected = await Reservation.update(
        // update 2 fields at the same time
        {
          providerUserId: null,
          status: isRequesterCancelling
            ? REV_STATUS_CANCELLED
            : REV_STATUS_CREATED,
        },
        { where: { id: reservationId } }
      );

      if (isRequesterCancelling) {
        const creditsUnblocked = calculateCredits(
          reservation.startDate,
          reservation.endDate
        );
        await User.decrement("blockedCredits", {
          by: creditsUnblocked,
          where: { id: userId },
        });
      }
      // DB Transaction : End here
      console.log("rows effected", rowsEffected, "will load", reservationId);
    }

    //find updated reservation
    const updatedReservation = await Reservation.findByPk(reservationId, {
      include: [
        { model: User, as: "requester" },
        { model: User, as: "provider" },
        Transaction,
      ],
    });

    console.log("canceled reservation by provider returns", updatedReservation);
    res.send(updatedReservation);
  } catch (e) {
    console.log(e.message);
    next(e);
  }
});

// APPROVE REZ.

router.post("/:id/approve", authMiddleware, async (req, res, next) => {
  try {
    const user = req.user;
    console.log("requester to approve ", user);

    if (!user) {
      return res.status(401).send("You need to login");
    }

    const requesterUserId = user.id;
    console.log("requester id ", requesterUserId);

    const reservationId = req.params.id;
    console.log(reservationId, "this is reservationId ");
    const reservation = await Reservation.findByPk(reservationId);

    if (requesterUserId !== reservation.requesterUserId) {
      return res.status(403).send("Only requester can approve");
    }
    if (reservation.status !== REV_STATUS_ACCEPTED) {
      return res.status(400).send("This reservation is not accepted");
    }
    // update reservation by approve button
    await Reservation.update(
      // update 2 fields at the same time
      { status: REV_STATUS_COMPLETED },
      { where: { id: reservationId } }
    );
    const credits = calculateCredits(
      reservation.startDate,
      reservation.endDate
    );

    // decrease credits and blocked credits of requester
    // increase provider credits
    await User.decrement("credits", {
      by: credits,
      where: { id: reservation.requesterUserId },
    });
    await User.decrement("blockedCredits", {
      by: credits,
      where: { id: reservation.requesterUserId },
    });
    await User.increment("credits", {
      by: credits,
      where: { id: reservation.providerUserId },
    });

    //find updated reservation
    const updatedReservation = await Reservation.findByPk(reservationId, {
      include: [
        { model: User, as: "requester" },
        { model: User, as: "provider" },
        Transaction,
      ],
    });
    console.log("completed reservation returns", updatedReservation);
    res.send(updatedReservation);
  } catch (e) {
    console.log(e.message);
    next(e);
  }
});

module.exports = router;

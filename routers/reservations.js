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
} = require("../config/constants");

const calculateCredits = (startDate, endDate) => {
  if (!startDate || !endDate) {
    return 0;
  }

  const sDate = new Date(startDate);
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

    //TODO DB Transaction : Start here
    await User.increment("blockedCredits", {
      by: creditsNeeded,
      where: { id: requesterUserId },
    });
    await Reservation.create(newReservation);
    //TODO DB Transaction : End here

    newReservation.creditsCost = creditsNeeded;

    console.log("new rez. object", newReservation);
    res.send(newReservation);
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
    const reservation = await Reservation.findByPk(reservationId);

    if (reservation.status !== REV_STATUS_CREATED) {
      return res.status(400).send("This reservation is already accepted");
    }
    // update reservation by accepting button
    const result = await Reservation.update(
      // update 2 fields at the same time
      { providerUserId: providerUserId, status: REV_STATUS_ACCEPTED },
      { where: { id: reservationId } }
    );

    res.send(result);
  } catch (e) {
    console.log(e.message);
    next(e);
  }
});

module.exports = router;

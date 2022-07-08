const { Router } = require("express");
const router = new Router();
const User = require("../models/").user;
const Reservation = require("../models/").reservation;
const Transaction = require("../models").transaction;
const authMiddleware = require("../auth/middleware");

router.get("/", async (req, res, next) => {
  try {
    const reservations = await Reservation.findAll({
      // include: [User, Transaction],
      include: [
        { model: User, association: "requester" },
        { model: User, association: "provider" },
      ],
    });
    res.send(reservations);
  } catch (e) {
    console.log(e.message);
    next(e);
  }
});

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

// new reservation post /reservations
router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const user = req.user;
    console.log("requester ", user);

    if (!user) {
      return res.status(401).send("You need to login");
    }

    const requesterUserId = parseInt(user.id);
    console.log("requester id ", requesterUserId);

    const { startDate, endDate, description, longitude, latitude, imageUrl } =
      req.body;
    const newReservation = {
      startDate,
      endDate,
      description,
      longitude,
      latitude,
      imageUrl,
      requesterUserId,
    };

    await Reservation.create(newReservation);
    console.log("new rez. object", newReservation);
    res.send(newReservation);
  } catch (e) {
    console.log("Error for new rez. :", e.message);
    next(e);
  }
});
module.exports = router;

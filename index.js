//packages
const express = require("express");
const corsMiddleWare = require("cors");
const { initScheduledJobs } = require("./scheduled/statusScheduler");
//routers
const authRouter = require("./routers/auth");
const reservationRouter = require("./routers/reservations");

//constants
const { PORT } = require("./config/constants");

// Create an express app
const app = express();

// CORS middleware:  * Since our api is hosted on a different domain than our client
// we are are doing "Cross Origin Resource Sharing" (cors)
// Cross origin resource sharing is disabled by express by default
app
  .use(corsMiddleWare())

  // express.json() to be able to read request bodies of JSON requests a.k.a. body-parser
  .use(express.json())

  //routes
  .use("/auth", authRouter)
  .use("/reservations", reservationRouter)

  //start listening
  .listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
  });

initScheduledJobs();

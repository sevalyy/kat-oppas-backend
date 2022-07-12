const CronJob = require("node-cron");
const moment = require("moment");

const updateExpiredReservations = () => {
  try {
    console.log("Updating status of expired reservations");
    //todo
  } catch (error) {
    console.log("updateExpiredReservations failed", error);
  }
};

const updateCompletedReservations = () => {
  try {
    // get the reservations that are accepted
    // see how long ago they finished
    // if > 1 day =>
    // make transaction between accounts
    // change status to completed

    // const fakeStartDate = moment(r.startDate);
    // const now = moment();

    // const diff = now.diff(fakeStartDate, "days");
    // console.log("days diff", diff);

    console.log("Updating status of completed reservations");
    //todo
  } catch (error) {
    console.log("updateCompletedReservations failed", error);
  }
};

exports.initScheduledJobs = () => {
  //Everyday at 15:00 see https://crontab.cronhub.io/ //* * * * *
  //const scheduledJobFunction = CronJob.schedule("0 15 * * *", () => {
  const statusScheduler = CronJob.schedule("1,30 * * * * *", () => {
    updateCompletedReservations();
    updateExpiredReservations();

    // const diffDays = (date) => {
    //   let today = new Date();
    //   let expire = new Date(date);
    //   let difference = new Date(expire).getTime() - new Date(today).getTime();
    //   return difference / (1000 * 3600 * 24);
    // };
    // 1. STATUS CHANGES
    // if(diffDays(r.startDate)<=0)(
    //   r.status==="expired"
    // )

    // 2. BLOCKED CREDIT BACK
    //
  });
  console.log("Scheduler scheduled.");
  statusScheduler.start();
};

const CronJob = require("node-cron");

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
    console.log("Updating status of completed reservations");
    //todo
  } catch (error) {
    console.log("updateCompletedReservations failed", error);
  }
};

exports.initScheduledJobs = () => {
  //Everyday at 15:00 see https://crontab.cronhub.io/ //* * * * *
  //const scheduledJobFunction = CronJob.schedule("0 15 * * *", () => {
  const statusScheduler = CronJob.schedule("* * * * *", () => {
    updateExpiredReservations();
    updateCompletedReservations();

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

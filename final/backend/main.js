const schedule = require('node-schedule');
// const { exec } = require('child_process');

function executeCommand() {
  console.log("Azizbek+++++");
}

schedule.scheduleJob('* * * * *', () => {
//   console.log('Running scheduled task...');
  executeCommand();
});

console.log('Scheduler is set up to run daily at 2:30 PM');

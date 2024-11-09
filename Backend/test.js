const { exec } = require('child_process');

// Path to your shell script and arguments
const scriptPath = './script.sh';
const arg1 = 'samvarank123@gmail.com';
const arg2 = 'Confirmation of Event Registration - LOCA';
const arg3 = 'Your Ticket to the event is confirmed';

// Command string with arguments
const command = `${scriptPath} "${arg1}" "${arg2}" "${arg3}"`;

// Execute the shell script with arguments
exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error executing script: ${error.message}`);
    return;
  }

  if (stderr) {
    console.error(`Error output: ${stderr}`);
    return;
  }
});
const { exec, spawn } = require('child_process');
const os = require('os');

const configuration = require('./config.json');

let batchFileName = '';

os.platform() === 'win32' ? batchFileName = 'config.bat' : 'config.sh';

let batchCommand = batchFileName;

for (var key in configuration) {
    if (configuration.hasOwnProperty(key)) {
        var apiObj = configuration[key];
        const { portNumber, status } = apiObj;
        batchCommand += ` ${status} ${portNumber}`
    }
}

exec(batchCommand, (error, stdout, stderr) => {
    if (error) {
        console.error(error);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
});

process.on('SIGINT', function () {
    if (os.platform() === 'win32') {
        exec('taskkill /IM node.exe -F');
        exec('taskkill /IM cmd.exe -F');
    } else {
        exec('killall node');
    }
});
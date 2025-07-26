import { spawn } from 'child_process';
import * as path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import AxiosRetry from 'axios-retry';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Global error handlers
process.on('unhandledRejection', (reason, promise) => {
    console.error('[ANTI-CRASH]: Unhandled Rejection!', reason, promise);
});

process.on('uncaughtException', (err, origin) => {
    console.error('[ANTI-CRASH]: Uncaught Exception!', err, origin);
});

process.on('uncaughtExceptionMonitor', (err, origin) => {
    console.error('[ANTI-CRASH]: Uncaught Exception Monitor!', err, origin);
});

const status = {
    ".": "Program exited with code: .",
    "0": "Program stopped, try running again...",
    "1": "Something error on program, exited with code: 1",
    "20": "Restarting program..."
};

function start() {
    let args = [path.join(__dirname, '/src/index.js'), ...process.argv.slice(2)];
    let session = spawn(process.argv[0], args, { stdio: ['inherit', 'inherit', 'inherit', 'ipc'] });

    session.on('message', data => {
        if (data === 'reset') {
            console.log('Restarting Bot...');
            session.kill();
            start();
        } else if (data === 'kill') {
            console.log('Program has stopped by shutdown command!');
            session.kill();
        } else if (data.type === 'error') {
            console.error('[ANTI-CRASH]: Error in child process!', data.error);
        }
    });

    session.on('exit', code => {
        console.error(status[code]);
        if (code == 1) return;
        if (code == '.' || code == 0) start();
    });

    session.on('error', err => {
        console.error('[ANTI-CRASH]: Error in child process!', err);
    });

    // Ensure Axios retry logic is set up
    AxiosRetry(axios, {
        retries: 3,
        retryCondition: (err) => {
            return ['ECONNRESET', 'ECONNABORTED', 'ENETUNREACH', 'ETIMEDOUT'].includes(err.code);
        }
    });

    // Axios interceptors for error handling
    axios.interceptors.response.use(
        res => res,
        err => {
            const code = err?.code;

            if (['ECONNRESET', 'ECONNABORTED', 'ENETUNREACH', 'ETIMEDOUT'].includes(code)) {
                console.error(`Error status "${code}" when requesting to: ${err?.config?.url}`);
                return Promise.reject(err);
            }

            return Promise.reject(err);
        }
    );

    // Local error handlers for the session
    session.on('unhandledRejection', (reason, promise) => {
        console.error('[ANTI-CRASH]: Unhandled Rejection in session!', reason, promise);
    });

    session.on('uncaughtException', (err, origin) => {
        console.error('[ANTI-CRASH]: Uncaught Exception in session!', err, origin);
    });

    session.on('uncaughtExceptionMonitor', (err, origin) => {
        console.error('[ANTI-CRASH]: Uncaught Exception Monitor in session!', err, origin);
    });
}

start();

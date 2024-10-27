import 'dotenv/config';

import http from 'node:http';

import app from './app';
import { logger } from './lib';
import { env } from './lib/config';

const server = http.createServer(app);

server.listen(env.PORT);

server.on('listening', () => {
    logger.info(`🚀 App started on port ${env.PORT}!`);
});

function shutdown(isFatal?: boolean) {
    logger.info('👋 App stopping...');
    server.close(() => {
        isFatal ? process.exit(1) : process.exit(0);
    });
}

server.on('error', (error) => {
    logger.error(error, '❌ Server error');
    shutdown(true);
});

process.on('unhandledRejection', (error) => {
    logger.fatal(error, '❌ Unhandled promise rejection');
    shutdown(true);
});

process.on('uncaughtException', (error) => {
    logger.fatal(error, '❌ Uncaught exception');
    shutdown(true);
});

process.on('SIGINT', () => {
    logger.info('🚧 SIGINT encountered!');
    shutdown();
});

process.on('SIGTERM', () => {
    logger.info('🚧 SIGTERM encountered!');
    shutdown();
});

process.on('exit', () => {
    logger.info('🛑 App stopped!');
});

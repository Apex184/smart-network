import 'dotenv/config';

import { Server as HttpServer } from 'node:http';
import { Server as SocketIOServer } from 'socket.io';
import { app } from './app';
import { logger } from './lib';
import { env } from './lib/config';

const server = new HttpServer(app);

const io = new SocketIOServer(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

server.listen(env.PORT, () => {
    logger.info(`🚀 App started on port ${env.PORT}!`);
});

io.on('connection', (socket) => {
    logger.info(`⚡️ User connected: ${socket.id}`);

    socket.on('message', (data) => {
        logger.info(`📨 Message received: ${data}`);
        io.emit('message', data);
    });

    socket.on('disconnect', () => {
        logger.info(`⚡️ User disconnected: ${socket.id}`);
    });
});

function shutdown(isFatal?: boolean) {
    logger.info('👋 App stopping...');
    server.close(() => {
        isFatal ? process.exit(1) : process.exit(0);
    });
}

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

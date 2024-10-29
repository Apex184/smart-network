import 'express-async-errors';

import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import favicon from 'serve-favicon';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { appRoutes } from './app/routes';
import { NotFoundError } from './lib/errors';
import { errorHandler, httpLogger } from './lib/middlewares';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const app = express();

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        new Sentry.Integrations.Express({ app }),
        nodeProfilingIntegration(),
    ],
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.set('trust proxy', true);
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());
app.use(httpLogger);
app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')));


app.get('/ping', (_req, res) => {
    res.send('pong');
});

app.get('/', (_req, res) => {
    res.send('Welcome to Roodi Technology Limited! ✍️');
});

app.use('/v1', appRoutes);


app.use((req, _res) => {
    throw new NotFoundError(`Route ${req.method} ${req.url}`);
});

app.use(Sentry.Handlers.errorHandler());
app.use(errorHandler);

export default app;

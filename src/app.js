import compression from 'compression';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import session from 'express-session';
import { applicationDefault, initializeApp } from 'firebase-admin/app';
import helmet from 'helmet';
import mongoose from 'mongoose';
import morgan from 'morgan';
import passport from 'passport';
import xss from 'xss-clean';

/**
 * Import: currentUser middleware for authentication.
 */
import { currentUser } from '@skeldon/sdv3-shared-library';

/**
 * Import custom logger function using winston
 */
import { stream } from './utils/logger.utils';

/**
 * Import: Database configuration
 */
import mongoDbConfig from './config/mongodb.config';

/**
 * Import: Error handlers
 */
import { NotFoundError } from './errors';
import errorHandler from './middlewares/errorHandler.middleware';

/**
 * Import: Routes
 */
import v1Routes from './routes/v1/index.route';

/**
 * Import all cron jobs
 */
import './jobs';

/**
 * Global env variables definition
 */
dotenv.config();

/**
 * Call the MongoDB connection based on the NODE_ENV setting
 * and return info about db name
 */
if (process.env.NODE_ENV === 'production') {
  mongoDbConfig.MongoDB().catch((err) => console.log(err));
} else {
  mongoDbConfig.MongoDBTest().catch((err) => console.log(err));
}

initializeApp({
  credential: applicationDefault(),
});

/**
 * Define App
 * @type {*|Express}
 */
const app = express();

/**
 * Trust Proxy
 */
app.set('trust proxy', true);

/**
 * Middleware definition
 */
app.use(morgan('combined', { stream }));

/**
 * Set security HTTP Headers
 */
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false, // set this false to prevent bug in new browser
  }),
);

/**
 * Parse json request body
 */
app.use(express.json());

/**
 * Parse urlencoded request body
 */
app.use(express.urlencoded({ extended: true }));

/**
 * Sanitize data
 */
app.use(xss());
app.use(mongoSanitize());

/**
 * GZIP compression
 */
app.use(compression());

/**
 * Parsing cookie
 */
app.use(cookieParser());

/**
 * Cookie policy definition
 * @type {string|number}
 */
const DEFAULT_ENV = process.env.NODE_ENV || 'development';
const COOKIE_MAX_AGE = process.env.COOKIE_MAX_AGE || 1000 * 60 * 60 * 24;
const SECRET = process.env.JWT_KEY || 'your_jwt_secret';

/**
 * define a second mongodb connection to store session.
 * workaround for Jest that crashes when using mongoUrl option
 */
const mongoSessionClient =
  DEFAULT_ENV === 'production'
    ? mongoose
        .connect(process.env.MONGO_URI)
        .then((m) => m.connection.getClient())
    : mongoose
        .connect(process.env.MONGO_URI_TEST)
        .then((m) => m.connection.getClient());

app.use(
  session({
    cookie: {
      // secure: DEFAULT_ENV === 'production',
      maxAge: COOKIE_MAX_AGE,
      httpOnly: true,
      sameSite: 'lax',
    },
    secret: SECRET,
    resave: false,
    saveUninitialized: false,
    /* Store session in mongodb */
    store: MongoStore.create({
      clientPromise: mongoSessionClient,
      stringify: false,
      autoRemove: 'interval',
      autoRemoveInterval: 1,
    }),
    unset: 'destroy',
  }),
);

/**
 * Use the shared library middleware to know who is logged in
 */
app.use(currentUser);

/**
 * Initialize Passport and pass the session to session storage of express
 * Strategies are called in the auth router
 * and in ./src/services/passport
 */
app.use(passport.initialize());
app.use(passport.session());

/**
 * CORS policy configuration
 */
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*', // allow CORS
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // allow session cookie from browser to pass through
  }),
);

/**
 * Headers configuration
 */
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL); // Update to match the domain you will make the request from
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  next();
});

/**
 * This MIDDLEWARE is to serve the public client build and redirect everything
 * to the client index.html. Replace the original one with public. Move build
 * inside the server folder and activate also the catchall middleware.
 */
// app.use(
//   express.static(path.join(__dirname, '../public'), {
//     index: 'index.html',
//   }),
// );

/**
 * Routes definitions
 */
app.use(`/api/v1/${process.env.SERVICE_NAME}`, v1Routes);

/**
 * Catchall middleware. Activate to serve every route in
 * the public directory i.e. if we have a build of React
 */
// app.use((req, res) =>
//   res.sendFile(path.resolve(path.join(__dirname, '../public/index.html'))),
// );

/**
 * This helper function is useful if we use express as a pure API endpoint
 * Everytime you hit a route that doesn't exist it returns a json error 404
 */
// eslint-disable-next-line no-unused-vars
app.all('*', (_) => {
  throw new NotFoundError('Resource not found on this server');
});

app.use(errorHandler);

export default app;

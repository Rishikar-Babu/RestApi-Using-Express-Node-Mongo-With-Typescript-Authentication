import express from 'express';
import mongoose from 'mongoose';
import logging from './library/loggin';
import http from 'http';
import path from 'path';
import userRouter from './routes/userRoutes';
import contactRouter from './routes/contactRoutes';
import * as dotenv from 'dotenv';
dotenv.config();
import htmlRouter from './routes/htmlRouter';
const app = express();
const port = 2325;
import cors from 'cors';

mongoose
    .connect('mongodb://localhost:27017/DB1')
    .then(() => {
        logging.info('Connected to  database..!');
        StartServer();
    })
    .catch((error) => {
        logging.info('error while connecting..!');
        logging.info(error);
    });

// only starts if mongoose connects to the database

const StartServer = () => {
    app.use((req, res, next) => {
        // Logg requests..

        logging.info(`Requested method [${req.method}] and  requested url : [${req.url}] and IP : [${req.socket.remoteAddress}]`);

        res.on('finish', () => {
            // Logg requests..

            logging.info(`Requested method [${req.method}] and  requested url : [${req.url}] and IP : [${req.socket.remoteAddress}]
             StatusCOde : [${req.statusCode}]`);
        });
        next();
    });

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    /* USing CORS */
    // Add a list of allowed origins.
    // If you have more origins you would like to add, you can add them to the array below.
    const allowedOrigins = ['*'];

    const options: cors.CorsOptions = {
        origin: allowedOrigins
    };
    app.use(cors(options));

    /* rules of APi */
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin ,X-requested Width, Content-Type, Accept ,Authorization');

        if (req.method == 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'PUT, POST , DELETE , GET');
            res.status(200).json({});
        }
        next();
    });

    /* Routings...! */

    app.get('/', (req, res) => {
        res.send('hi hello');
    });
    app.use('/user', userRouter);
    app.use('/contact', contactRouter);
    app.set('view engine', 'pug');
    app.set('views', path.join(__dirname, 'views'));
    app.use('/html', htmlRouter);

    /* ERROR HANDLING..! */

    app.use((req, res, next) => {
        const error = new Error('not found.!');
        logging.error(error);

        return res.status(404).json({ msg: error.message });
    });

    /*SERVER PORT */

    http.createServer(app).listen(port, () => {
        logging.info(`server running successfully on the ${port}`);
    });
};

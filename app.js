import compression from 'compression';
import cors from "cors";
import express from 'express';
import mongoose from 'mongoose';

import { appConfig } from './config/app-config.js';
import routes from './routes/routes.js'
const app = express();

app.use(compression());

// Set Body Parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Mongoose Connection to Database
mongoose.Promise = global.Promise;

mongoose.connect(appConfig.DATABASE_URL)
    .then(() => {
        console.log('Connected to mongo db ....');
    })
    .catch(err => {
        console.log('Error occured ' + err);
    });


//Setup CORS
app.use(cors({origin: "*"}))

routes(app);

export default app;

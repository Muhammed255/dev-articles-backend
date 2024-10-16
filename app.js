import compression from 'compression';
import cors from "cors";
import express from 'express';
import mongoose from 'mongoose';
import serverless from 'serverless-http'

import { appConfig } from './config/app-config.js';
import { articlePostRoutes } from './routes/article-post.routes.js';
import { authRouter } from './routes/auth.routes.js';
import { categoryRoutes } from './routes/category.routes.js';
import { topicRoutes } from './routes/topic.routes.js';
import routes from './routes/routes.js'
const app = express();

const port = process.env.PORT || "3000";

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

import path from 'path';
import express from 'express';
import mongoose from 'mongoose';
import compression from 'compression';
import cors from "cors";

import { authRouter } from './routes/auth.routes.js';
import { appConfig } from './config/app-config.js';
import { categoryRoutes } from './routes/category.routes.js';
import { topicRoutes } from './routes/topic.routes.js';
import { articlePostRoutes } from './routes/article-post.routes.js';

const app = express();

const port = process.env.PORT || "3000";

app.use(compression());

// Set Body Parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Mongoose Connection to Database
mongoose.Promise = global.Promise;

mongoose.connect(appConfig.DATABASE_URL, {
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then(() => {
        console.log('Connected to mongo db ....');
    })
    .catch(err => {
        console.log('Error occured ' + err);
    });


//Setup CORS
app.use(cors({origin: "*"}))

app.use('/api/users', authRouter);

app.use('/api/categories', categoryRoutes);

app.use('/api/topics', topicRoutes);

app.use('/api/articles', articlePostRoutes)


app.listen(port, () => {
    console.log("running on port 3000");
})

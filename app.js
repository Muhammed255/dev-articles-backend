import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import { authRouter } from './routes/auth.routes';
import { appConfig } from './config/app-config';
import { categoryRoutes } from './routes/category.routes';
import { topicRoutes } from './routes/topic.routes';
import { articlePostRoutes } from './routes/article-post.routes';

const app = express();

// Set Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(function(req, res, next) {
    // IE9 doesn't set headers for cross-domain ajax requests
    if(typeof(req.headers['content-type']) === 'undefined'){
        req.headers['content-type'] = "application/json; charset=UTF-8";
    }
    next();
})
.use(bodyParser.json());

// Mongoose Connection to Database
mongoose.Promise = global.Promise;

mongoose.connect(appConfig.database, {
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then(() => {
        console.log('Connected to mongo db ....');
    })
    .catch(err => {
        console.log('Error occur ' + err);
    });


//Setup CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');

    res.header(
        'Access-Control-Allow-Methods',
        'GET,PUT,POST,DELETE,OPTIONS, PATCH'
    );

    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    next();
});


app.use('/images/topics', express.static(path.join('backend/images/topics')));

app.use('/images/posts', express.static(path.join('backend/images/posts')));


app.use('/api/users', authRouter);

app.use('/api/categories', categoryRoutes);

app.use('/api/topics', topicRoutes);

app.use('/api/articles', articlePostRoutes)


export default app;

import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import graphqlHTTP from 'express-graphql'
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';
import http from 'http';
import cors from 'cors'
require('dotenv').config();

import schema from './modules/api/schema';
import { getUserContext } from './modules/auth';
import uploadMiddleWare from './uploadMiddleware';

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_DB_URL, { useNewUrlParser: true });

const port = process.env.PORT || 8000

const db = mongoose.connection;
db
  .on('error', e => console.log(e))
  .once('open', () => console.log('Connection to Database established.'));

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const staticPath = path.join(__dirname, '..', 'frontend', 'public', 'static')
const publicPath = path.join(__dirname, '..', 'frontend', 'public', 'index.html')

app.use(express.static(staticPath));
app.get('/*', (_req, res) => {
  res.sendFile(publicPath);
});

app.use('/graphql', cors(), uploadMiddleWare)
app.use(
  '/graphql',
  cors(),
  graphqlHTTP(async (req, _res, _next) => {
    const user = await getUserContext(req.headers.authorization);
    return {
      schema,
      pretty: true,
      graphiql: true,
      context: {
        user
      }
    };
  })
);

app.listen(port, () => console.log(`Express server listening on port ${port}`))
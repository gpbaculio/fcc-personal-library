import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import graphqlHTTP from 'express-graphql'
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';
import { createServer } from 'http';
import cors from 'cors'
import multer from 'multer'

require('events').EventEmitter.defaultMaxListeners = 0;
require('dotenv').config();

import schema from './modules/api/schema';
import { getUserContext } from './modules/auth';

const storage = multer.memoryStorage();

mongoose.Promise = global.Promise;
mongoose.connect(
  process.env.MONGO_DB_URL,
  {
    useNewUrlParser: true
  }
);

const port = process.env.PORT || 8000

const db = mongoose.connection;
db
  .on('error', e => console.log(e))
  .once('open', () => console.log('Connection to Database established.'));

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())
const staticPath = path.join(__dirname, '..', 'frontend', 'build')
const publicPath = path.join(__dirname, '..', 'frontend', 'build', 'index.html')

app.use(multer({ storage }).fields([{ name: 'image' }]));
app.use(express.static(staticPath));
app.get('/*', (_req, res) => res.sendFile(publicPath));

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
        user,
        request: req
      }
    };
  })
);

const webServer = createServer(app);

webServer.listen(port, () => {
  console.log(`GraphQL is now running on http://localhost:${port}`);
  // Set up the WebSocket for handling GraphQL subscriptions.
  new SubscriptionServer({
    onConnect: connectionParams => console.log('client subscription connected!'),
    onDisconnect: () => console.log('client subscription disconnected!'),
    execute,
    subscribe,
    schema
  }, {
      server: webServer,
      path: '/subscriptions',
    });
});
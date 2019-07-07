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
import { getUser } from './modules/database';

mongoose.Promise = global.Promise;
mongoose.connect(
  process.env.MONGO_DB_URL, { useNewUrlParser: true }
);

const port = process.env.PORT || 8000

const db = mongoose.connection;
db
  .on('error', e => console.log(e))
  .once('open', () => console.log('Connection to Database established.'));

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app.use('/public', express.static(path.join(__dirname, '../public')));
// app.get('/*', function (_, res) {
//   res.sendFile(path.join(__dirname, '../public/index.html'));
// });

app.use(
  '/graphql',
  cors(),
  graphqlHTTP((req, res, next) => {
    const { user } = getUser(req.headers.authorization);
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

// const server = http.createServer(app);

// server.listen(port, () => {
//   new SubscriptionServer(
//     {
//       onConnect: connectionParams =>
//         console.log('client subscription connected!', connectionParams),
//       onDisconnect: () => console.log('client subscription disconnected!'),
//       execute,
//       subscribe,
//       schema
//     },
//     { server, path: '/subscriptions' }
//   );
// });

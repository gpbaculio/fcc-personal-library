import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { graphiqlExpress, graphqlExpress } from 'apollo-server-express';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';
import http from 'http';
require('dotenv').config();

import schema from './modules/api/schema';
// import { getUser } from './modules/utils';

mongoose.Promise = global.Promise;
mongoose.connect(
  process.env.MONGO_DB_URL,
  {
    server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
    replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }
  }
);

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
  graphqlExpress(async (req, res, next) => {
    // let { user } = await getUser(req.headers.authorization);
    return {
      schema,
      pretty: true,
      graphiql: true,
      // context: {
      //   user
      // }
    };
  })
);
app.use(
  '/graphiql',
  graphiqlExpress({
    endpointURL: '/graphql',
    subscriptionsEndpoint: `ws://${process.env.HOST}:${process.env.PORT}/subscriptions`
  })
);
const server = http.createServer(app);
server.listen(port, () => {
  new SubscriptionServer(
    {
      onConnect: connectionParams =>
        console.log('client subscription connected!', connectionParams),
      onDisconnect: () => console.log('client subscription disconnected!'),
      execute,
      subscribe,
      schema
    },
    { server, path: '/subscriptions' }
  );
});

const { Prisma } = require('prisma-binding');
const { GraphQLServer } = require('graphql-yoga');

const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const AuthPayload = require('./resolvers/AuthPayload');
const Subscription = require('./resolvers/Subscription');
const find = require('lodash/find');
const { handleLinkUpdate } = require('./helpers');

const resolvers = {
  Query,
  Mutation,
  AuthPayload,
  Subscription
};

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: (req) => ({
    ...req,
    db: new Prisma({
      typeDefs: 'src/generated/prisma.graphql',
      endpoint: 'https://us1.prisma.sh/public-nickelfairy-857/hacker-news-node/dev',
      secret: 'mysecret123',
      debug: true
    })
  })
});

server.start(() => console.log('Server is running on http://localhost:4000'));

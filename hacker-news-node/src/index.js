const { Primsa } = require('prisma-binding');
const { GraphQLServer } = require('graphql-yoga');

const find = require('lodash/find');
const { handleLinkUpdate } = require('./helpers');

const resolvers = {
  Query: {
    info: () => 'This is a Hacker News GraphQL API',
    feed: (root, args, context, info) => context.db.query.links({}, info),
    link: (root, { id }) => find(links, { id })
  },

  Mutation: {
    post: (root, args, context, info) =>
      context.db.mutation.createLink(
        {
          data: {
            url: args.url,
            description: args.description
          }
        },
        info
      ),

    updateLink: (root, { id, description, url }) => {
      links = links.map(handleLinkUpdate(id));

      return find(links, { id });
    },

    deleteLink: (root, { id }) => {
      let deletedLink = null;

      links = links.filter((l) => {
        if (l.id !== id) return true;

        deletedLink = l;

        return false;
      });

      return deletedLink;
    }
  }
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

const find = require('lodash/find');

const { GraphQLServer } = require('graphql-yoga');
const { handleLinkUpdate } = require('./helpers');

let links = [
  {
    id: 'link-0',
    url: 'howtographql.com',
    description: 'Fullstack tutorial for GraphQL'
  }
];

let linkCount = links.length;

const resolvers = {
  Query: {
    info: () => 'This is a Hacker News GraphQL API',
    feed: () => links,
    link: (root, { id }) => find(links, { id })
  },

  Mutation: {
    post: (root, { description, url }) => {
      const link = {
        id: `link-${linkCount++}`,
        description,
        url
      };

      links.push(link);

      return link;
    },

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
  resolvers
});

server.start(() => console.log('Server is running on http://localhost:4000'));

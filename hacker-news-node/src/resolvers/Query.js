const feed = (parent, args, context, info) => context.db.query.links({}, info);

const link = (parent, args, context, info) => find(links, { id: args.id });

module.exports = {
  feed,
  link
};

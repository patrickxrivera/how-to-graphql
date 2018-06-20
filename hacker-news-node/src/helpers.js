const handleLinkUpdate = (targetId) => (l) => (l.id === targetId ? updateLink(l) : l);

const updateLink = ({ id, description, url }) => ({
  id,
  description,
  url
});

module.exports = {
  handleLinkUpdate
};

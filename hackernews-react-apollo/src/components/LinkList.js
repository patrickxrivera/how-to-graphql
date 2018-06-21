import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import React, { Component } from 'react';
import Link from './Link';

const queryState = (prop) => (query) => query && query[prop];

const isLoading = queryState('loading');

const isError = queryState('error');

class LinkList extends Component {
  updateCacheAfterVote = (store, createVote, linkId) => {
    const data = store.readQuery({ query: FEED_QUERY });

    const votedLink = data.feed.links.find((link) => link.id === linkId);
    votedLink.votes = createVote.link.votes;

    store.writeQuery({ query: FEED_QUERY, data });
  };

  render() {
    const { feedQuery } = this.props;

    switch (true) {
      case isLoading(feedQuery):
        return <div>Loading</div>;
      case isError(feedQuery):
        return <div>Error</div>;
      default:
        const linksToRender = feedQuery.feed.links;
        return <div>{linksToRender.map(renderLink(this.updateCacheAfterVote))}</div>;
    }
  }
}

const renderLink = (updateCacheAfterVote) => (link, idx) => (
  <Link key={link.id} updateStoreAfterVote={updateCacheAfterVote} idx={idx} link={link} />
);

export const FEED_QUERY = gql`
  query FeedQuery {
    feed {
      links {
        id
        description
        url
        createdAt
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
    }
  }
`;

export default graphql(FEED_QUERY, { name: 'feedQuery' })(LinkList);

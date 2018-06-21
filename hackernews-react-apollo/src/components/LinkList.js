import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import React, { Component } from 'react';
import Link from './Link';

const queryState = (prop) => (query) => query && query[prop];

const isLoading = queryState('loading');

const isError = queryState('error');

class LinkList extends Component {
  render() {
    const { feedQuery } = this.props;

    switch (true) {
      case isLoading(feedQuery):
        return <div>Loading</div>;
      case isError(feedQuery):
        return <div>Error</div>;
      default:
        const linksToRender = feedQuery.feed.links;
        return <div>{linksToRender.map(renderLink)}</div>;
    }
  }
}

const renderLink = (link) => <Link key={link.id} link={link} />;

const FEED_QUERY = gql`
  query FeedQuery {
    feed {
      links {
        id
        description
        url
        createdAt
      }
    }
  }
`;

export default graphql(FEED_QUERY, { name: 'feedQuery' })(LinkList);

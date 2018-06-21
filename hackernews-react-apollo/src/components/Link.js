import React, { Component } from 'react';

class Link extends Component {
  voteForLink = async () => {};

  render() {
    const { description, url } = this.props.link;

    return (
      <div>
        <div>
          {description} ({url})
        </div>
      </div>
    );
  }
}

export default Link;

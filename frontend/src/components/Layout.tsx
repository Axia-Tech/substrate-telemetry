import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Chains } from './Chains';

export default class Layout extends Component {
  render() {
    return <div>{this.props.children}</div>;
  }
}

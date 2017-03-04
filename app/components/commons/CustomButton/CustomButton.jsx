import React from 'react';

import CustomButtonCss from './CustomButton.css';



export default class CustomButton extends React.Component {
  render() {
    let classes = "pull-right btn btn-custom";
    if (this.props.className) {
      classes += " " + this.props.className;
    }
    let props = {...this.props};
    delete props['className'];
    return (
      <button className={ classes } {...props}>
        { this.props.children }
      </button>
    );
  }
}

CustomButton.propTypes = {
  onClick: React.PropTypes.func,
  children: React.PropTypes.any
};

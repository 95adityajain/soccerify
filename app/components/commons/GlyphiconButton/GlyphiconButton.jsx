import React from 'react';

import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Button from 'react-bootstrap/lib/Button';

import GlyphiconButtonCss from './GlyphiconButton.css';

export default class GlyphiconButton extends React.Component {
  render() {
    const glyph = this.props.glyph;
    const optionalProps = {...this.props};
    delete optionalProps['glyph'];

    return (
      <Button bsStyle="link" className="btn-glyphicon-custom"
        style={{outline:'none'}} {...optionalProps}>

        <Glyphicon glyph={glyph} />
      </Button>
    );
  }
}

GlyphiconButton.propTypes = {
  glyph: React.PropTypes.string.isRequired
};

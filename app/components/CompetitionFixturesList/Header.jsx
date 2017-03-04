import React from 'react';

import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';
import Button from 'react-bootstrap/lib/Button';
import GlyphiconButton from '../commons/GlyphiconButton/GlyphiconButton';
import Tooltip from 'react-bootstrap/lib/Tooltip';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import ErrorAlert from '../commons/ErrorAlert/ErrorAlert';
import ProgressBar from 'react-bootstrap/lib/ProgressBar';
import Label from 'react-bootstrap/lib/Label';



const RefreshButtonTooltip = (
  <Tooltip id="tooltip">Update all fixtures for this competition</Tooltip>
);

const LeagueCaption = ({ caption }) => {
  return (<b>{ caption } </b>);
};

const MatchdayDisplay = ({ currentMatchday }) => {
  return (<small className="matchday">Matchday - { currentMatchday }</small>);
};

const CustomRow = ({ children }) => {
  return (
    <Row className="list-group-item-heading">
      <center>{ children }</center>
    </Row>
  );
};

const UpdateStatus = () => {
  return (
    <div>
      <Label bsStyle="success">Updated successfully</Label>
      <Label bsStyle="danger">Error occured while updating</Label>
    </div>
  );
};

const AlertContainer = () => {
  return (
    <Col xs={10} xsOffset={1} md={8} mdOffset={2}>
      <ErrorAlert showStatus={true} alertMessage={"No fixtures available"} />
    </Col>
  );
};

const LoadingContainer = () => {
  return (
    <Col xs={10} xsOffset={1} md={8} mdOffset={2}>
      <ProgressBar active now={100} />
    </Col>
  );
};

const HeaderTop = (props) => {
  return (
    <h4>
      <LeagueCaption {...props} />
      <OverlayTrigger placement="left" overlay={ RefreshButtonTooltip }>
        <span><GlyphiconButton glyph="refresh" /></span>
      </OverlayTrigger>
    </h4>
  );
};

const HeaderMiddle = (props) => {
  return (
    <div>
      <GlyphiconButton glyph="chevron-left" />
      <MatchdayDisplay {...props} />
      <GlyphiconButton glyph="chevron-right" />
    </div>
  );
};

const HeaderBottom = () => {
  return (
    <div>
      <UpdateStatus />
      <AlertContainer />
      <LoadingContainer />
    </div>
  );
};

export default class Header extends React.Component {
  render() {
    const competition = this.props.competition;
    return (
      <ListGroupItem className="header">
        <CustomRow>
          <HeaderTop { ...competition } />
          <HeaderMiddle { ...competition } />
          <HeaderBottom { ...competition } />
        </CustomRow>
      </ListGroupItem>
    );
  }
}

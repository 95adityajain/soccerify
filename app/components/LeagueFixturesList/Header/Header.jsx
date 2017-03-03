import React from 'react';

import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';
import Button from 'react-bootstrap/lib/Button';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Tooltip from 'react-bootstrap/lib/Tooltip';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Alert from 'react-bootstrap/lib/Alert';
import ProgressBar from 'react-bootstrap/lib/ProgressBar';
import Label from 'react-bootstrap/lib/Label';

import HeaderCss from './Header.css';



const RefreshButtonTooltip = (
  <Tooltip id="tooltip">Update all fixtures for this competition</Tooltip>
);

const LeagueCaption = ({ caption }) => {
  return (<b>{ caption } </b>);
};

const MatchdayDisplay = ({ currentMatchday }) => {
  return (<small id="matchday">Matchday - { currentMatchday }</small>);
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
      <Alert bsStyle="danger">
          <Button bsStyle="danger" className="pull-right">Fetch</Button>
          <h4><b>No Fixtures available</b></h4>
      </Alert>
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
      <OverlayTrigger placement="top" overlay={ RefreshButtonTooltip }>
        <Button bsStyle="link" className="btn-link-custom" data-index="index" data-action="refresh_get">
          <Glyphicon glyph="refresh" />
        </Button>
      </OverlayTrigger>
    </h4>
  );
};

const HeaderMiddle = (props) => {
  return (
    <div>
      <Button bsStyle="link" className="btn-link-custom" data-index="index" data-action="previous_get">
        <Glyphicon glyph="chevron-left" />
      </Button>
      <MatchdayDisplay {...props} />
      <Button bsStyle="link" className="btn-link-custom" data-index="index" data-action="next_get">
        <Glyphicon glyph="chevron-right" />
      </Button>
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
    const leagueDetails = this.props.league;
    return (
      <ListGroupItem className="header">
        <CustomRow>
          <HeaderTop { ...leagueDetails } />
          <HeaderMiddle { ...leagueDetails } />
          <HeaderBottom { ...leagueDetails } />
        </CustomRow>
      </ListGroupItem>
    );
  }
}

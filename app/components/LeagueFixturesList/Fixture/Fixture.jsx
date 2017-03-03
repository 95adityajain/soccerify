import React from 'react';

import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';
import Tooltip from 'react-bootstrap/lib/Tooltip';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';

import FixtureCss from './Fixture.css';



const FixtureTop = () => {
  return (
    <Row>
      <Col md={5} xs={5}> 
        <small> 23-Feb </small>
      </Col>
      <Col xs={2} md={2}></Col>
      <Col xs={5} md={5}>
        <p className="align-right"><small>Finished</small></p>
      </Col>
    </Row>
  );
};
const ResultDisplay = () => {
  return (<center> 2 - 0 </center>);
};
const AwayTeamDisplay = () => {
  const fullNameTooltip = <Tooltip id="tooltip_1">Real Madrid FC</Tooltip>;
  return (
    <Row>
      <Col mdOffset={3} md={7} xs={9}>
        <p className="align-right">
          <OverlayTrigger placement="left" overlay={ fullNameTooltip }>
            <span>Real Madrid</span>
          </OverlayTrigger>
        </p>
      </Col>
      <Col md={2} xs={3}>
        <img className="media-object crest-img" src="http://upload.wikimedia.org/wikipedia/de/3/3f/Real_Madrid_Logo.svg" alt="" />
      </Col>
    </Row>
  );
};
const HomeTeamDisplay = () => {
  const fullNameTooltip = <Tooltip id="tooltip_2">Real Madrid FC</Tooltip>;
  return (
    <Row>
      <Col md={2} xs={2}>
        <img className="media-object align-right crest-img" src="http://upload.wikimedia.org/wikipedia/de/3/3f/Real_Madrid_Logo.svg" alt="" />
      </Col>
      <Col md={10} xs={10}>
        <p>
          <OverlayTrigger placement="right" overlay={ fullNameTooltip }>
            <span>Real Madrid</span>
          </OverlayTrigger>
        </p>
      </Col>
    </Row>
  );
};
const FixtureBottom = () => {
  return (
    <Row>
      <Col md={5} xs={5}>
        <HomeTeamDisplay />
      </Col>
      <Col xs={2} md={2}>
        <ResultDisplay />
      </Col>
      <Col md={5} xs={5}>
        <AwayTeamDisplay />
      </Col>
    </Row>
  );
};

export default class Fixture extends React.Component {
  render() {
      const fixture = this.props.fixture;
      return (
        <ListGroupItem>
          <FixtureTop />
          <FixtureBottom />
        </ListGroupItem>
      );
  }
}

import React from 'react';

import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';
import Tooltip from 'react-bootstrap/lib/Tooltip';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';



const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const STATUS = {
  "FINISHED": {val: "Finished", showScore: true, showTime: false},
  "IN_PLAY": {val: "Live", showScore: true, showTime: false},
  "CANCELED": {val: "Canceled", showScore: false, showTime: false},
  "POSTPONED": {val: "Postponed", showScore: false, showTime: false},
  "SCHEDULED": {val: "", showScore: false, showTime: true},
  "TIMED": {val:"", showScore: false, showTime: true}
};

const FixtureTop = ({ date, stat }) => {
  return (
    <Row>
      <Col md={5} xs={5}> 
        <small>{ getDisplayDate(date) }</small>
      </Col>
      <Col xs={2} md={2}></Col>
      <Col xs={5} md={5}>
        <p className="align-right">
          <small>{ getStatusDisplay(stat, date) }</small>
        </p>
      </Col>
    </Row>
  );
};
const ResultDisplay = ({ res, stat }) => {
  return (<center>{ getResultDisplay(res, stat) }</center>);
};
const AwayTeamDisplay = ({ awayTeam }) => {
  const fullNameTooltip = (
    <Tooltip id={ "tooltip_"+awayTeam._id }>
      { awayTeam.name }
    </Tooltip>
  );
  return (
    <Row>
      <Col mdOffset={3} md={7} xs={10}>
        <p className="align-right">
          <OverlayTrigger placement="left" overlay={ fullNameTooltip }>
            <span>{ awayTeam.shortName }</span>
          </OverlayTrigger>
        </p>
      </Col>
      <Col md={2} xs={2}>
        <img className="media-object crest-img" style={{float: 'right'}} 
          src={ awayTeam.crestUrl } alt="" />
      </Col>
    </Row>
  );
};
const HomeTeamDisplay = ({ homeTeam }) => {
  const fullNameTooltip = (
    <Tooltip id={ "tooltip_"+homeTeam._id }>
      { homeTeam.name }
    </Tooltip>
  );
  return (
    <Row>
      <Col md={2} xs={2}>
        <img className="media-object crest-img" 
          src={ homeTeam.crestUrl } alt="" />
      </Col>
      <Col md={10} xs={10}>
        <p>
          <OverlayTrigger placement="right" overlay={ fullNameTooltip }>
            <span>{ homeTeam.shortName }</span>
          </OverlayTrigger>
        </p>
      </Col>
    </Row>
  );
};
const FixtureBottom = (props) => {
  return (
    <Row>
      <Col md={5} xs={5}>
        <HomeTeamDisplay { ...props } />
      </Col>
      <Col xs={2} md={2}>
        <ResultDisplay { ...props } />
      </Col>
      <Col md={5} xs={5}>
        <AwayTeamDisplay { ...props } />
      </Col>
    </Row>
  );
};

export default class Fixture extends React.Component {
  render() {
    const { fixture, teams } = this.props;
    const fixtureBottomProps = {
      homeTeam: teams[fixture.htId],
      awayTeam: teams[fixture.atId],
      res: fixture.res,
      stat: fixture.stat
    }
    return (
      <ListGroupItem>
        <FixtureTop { ...fixture } />
        <FixtureBottom { ...fixtureBottomProps } />
      </ListGroupItem>
    );
  }
}
Fixture.proptypes = {
  fixture: React.PropTypes.object.isRequired,
  teams: React.PropTypes.object.isRequired
};

//HELPER
const getDisplayDate = (d) => {
  const date = new Date(d);
  return date.getDate() + '-' + MONTHS[date.getMonth()];
};
const getResultDisplay = (res, stat) => {
  if (STATUS[stat]['showScore']) {
    return res.ght + " - " + res.gat;
  } else {
    return "vs";
  }
};
const getStatusDisplay = (stat, date) => {
  if (STATUS[stat]['showTime']) {
    const d = new Date(date);
    const hrs = d.getHours();
    return hrs + ":" + d.getMinutes() + ((hrs <= 11) ? " a.m" : " p.m");
  } else {
    return STATUS[stat]['val'];
  }
};

import React from 'react';

import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';



export default class Team extends React.Component {
  render() {
    const { team, teamId, preferences, onCheckboxClick } = this.props;
    return (
      <ListGroupItem>
        <Row>
          <Col md={2} xs={2}>
            <img className="media-object team-img" 
              src={ team.crestUrl } alt="" />
          </Col>
          <Col md={8} xs={8}>
            <center><h4>{ team.shortName }</h4></center>
          </Col>
          <Col md={2} xs={2}>
            <input type="checkbox" style={{outline: 'none'}}
              className="team-select-checkbox" 
              value={ teamId } 
              checked={ (preferences[teamId]) ? true : false }
              onChange={ onCheckboxClick } />
          </Col>
        </Row>
      </ListGroupItem>
    );
  }
};
Team.propTypes = {
  team: React.PropTypes.object.isRequired,
  teamId: React.PropTypes.any.isRequired,
  preferences: React.PropTypes.object.isRequired,
  onCheckboxClick: React.PropTypes.func.isRequired
};

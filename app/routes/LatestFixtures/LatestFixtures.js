import React from 'react';

import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Grid from 'react-bootstrap/lib/Grid';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import { Link } from 'react-router';

import CompetitionFixturesList from '../../components/CompetitionFixturesList/CompetitionFixturesList';
import LatestFixturesCss from './LatestFixtures.css';



const LatestFixturesHeader = () => {
  return (
    <div>
      <Row>
        <Col xs={12} className="latest-fixtures-header">
          <center><h2>Soccerify</h2></center>
        </Col>
      </Row>
      <div className="divider"></div>
      <Row className="row">
        <Col xs={12}>
          <h4 className="pull-right">
            <Link to="editPreferences" style={{color: '#7986CB'}}>
              <Glyphicon glyph="cog" />
            </Link>
          </h4>
          <h4>Latest Fixtures</h4>
        </Col>
      </Row>
    </div>
  );
};

export default class LatestFixtures extends React.Component {
  render() {
    return (
      <Grid fluid>
        <LatestFixturesHeader />
        <CompetitionFixturesList { ...this.props } />
      </Grid>
    );
  }
}

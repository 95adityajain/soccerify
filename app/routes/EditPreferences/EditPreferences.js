import React from 'react';

import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Grid from 'react-bootstrap/lib/Grid';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import { Link } from 'react-router';

import CompetitionList from '../../components/CompetitionList/CompetitionList';
import EditPreferencesCss from './EditPreferences.css';



const EditPreferencesHeader = () => {
  return (
    <Row className="edit-preferences-header">
      <Col md={6} xs={6}>
        <h2>
          <span>Soccerify</span>
        </h2>
      </Col>
      <Col md={6} xs={6}>
        <h2 className="pull-right">
          <Link to="/" style={{color: 'white'}}>
            <Glyphicon glyph="calendar" />
          </Link>
        </h2>
      </Col>
    </Row>
  );
};

export default class EditPreferences extends React.Component {
  render() {
    return (
      <Grid fluid>
        <EditPreferencesHeader />
        <CompetitionList />
      </Grid>
    );
  }
}

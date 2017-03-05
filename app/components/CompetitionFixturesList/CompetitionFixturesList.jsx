import React from 'react';

import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import ListGroup from 'react-bootstrap/lib/ListGroup';

import Header from './Header';
import Fixture from './Fixture';
import CustomLoading from '../commons/CustomLoading/CustomLoading';
import ErrorAlert from '../commons/ErrorAlert/ErrorAlert';

import CompetitionFixturesListCss from './CompetitionFixturesList.css';



const FetchStatus = ({ status }) => {
  return (
    <Row>
      <Col xs={10} xsOffset={1} md={8} mdOffset={2}>
        <CustomLoading />
        <ErrorAlert showStatus={true} 
          alertMessage={"No preferences available"} 
          buttonMessage={"Edit Preferences"} />
      </Col>
    </Row>
  );
};
const FixturesList = ({ fixturesList }) => {
  let fixtures = fixturesList.map((fixture, index) => {
    return (<Fixture {...fixture} key={index} />);
  });
  return (<div>{fixtures}</div>);
};

export default class CompetitionFixturesList extends React.Component {
  render() {
    return (
      <ListGroup componentClass='div'>
        <Header competition={this.props.competition} />
        <FixturesList fixturesList={this.props.fixturesList}/>
        <FetchStatus />
      </ListGroup>
    );
  }
}

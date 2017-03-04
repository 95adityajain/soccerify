import React from 'react';
import ListGroup from 'react-bootstrap/lib/ListGroup';

import Header from './Header';
import Fixture from './Fixture';

import CompetitionFixturesListCss from './CompetitionFixturesList.css';

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
      </ListGroup>
    );
  }
}

import React from 'react';

import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';

import Header from './Header';
import Fixture from './Fixture';

import {
  getFixtures,
  refreshAndGetFixtures
} from '../../redux/modules/fixtures';
import { getTeams } from '../../redux/modules/teams';


const FixturesList = ({ fixtures, teams, preferences }) => {
  let fixturesList = fixtures.map((fixture, index) => {
    return (preferences[fixture.htId] || preferences[fixture.atId]) ? 
      (<Fixture fixture={ fixture } teams={ teams } key={ index } />) : null;
  });
  return (<div>{ fixturesList }</div>);
};

export default class PerCompetitionFixturesList extends React.Component {
  constructor() {
    super();
    this.getNextMatchdayFixtures = this.getNextMatchdayFixtures.bind(this);
    this.getPreviousMatchdayFixtures = 
      this.getPreviousMatchdayFixtures.bind(this);
    this.refreshFixtures = this.refreshFixtures.bind(this);
  }

  getNextMatchdayFixtures() {
    const { store } = this.context;
    const { competition } = this.props;
    if (competition.currentMatchday == competition.numberOfMatchdays) {
      return;
    }
    store.dispatch(getFixtures(competition._id, competition.currentMatchday+1));
  }
  getPreviousMatchdayFixtures() {
    const { store } = this.context;
    const { competition } = this.props;
    if (competition.currentMatchday == 1) {
      return;
    }
    store.dispatch(getFixtures(competition._id, competition.currentMatchday-1));
  }
  refreshFixtures() {
    const { store } = this.context;
    const { competition } = this.props;
    store.dispatch(refreshAndGetFixtures(
      competition._id,
      competition.currentMatchday
    ));
  }

  componentWillMount() {
    const { store } = this.context;
    const { competition } = this.props;
    store.dispatch(getTeams(competition._id));
    store.dispatch(getFixtures(competition._id, competition.currentMatchday));
  }
  componentDidMount() {
    const { store } = this.context;
    this.unsubscribe = store.subscribe(() => {
      this.forceUpdate();
    });
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  render() {
    const { store } = this.context;
    const state = store.getState();

    const { competition, preferences } = this.props;  
    const teams = state['teams'][competition._id];
    const fixtures = state['fixtures'][competition._id];
    const fetchStatus = {
      isProcessing: (teams['isProcessing'] || 
        fixtures[competition.currentMatchday]['isProcessing'] ||
        (fixtures['refresh'] && fixtures['refresh']['isProcessing']))
          ? true : false,
      error: (teams['error'] || 
        fixtures[competition.currentMatchday]['error'])
          ? true : false,
      onButtonClick: function() {
        store.dispatch(getTeams(competition._id));
        store.dispatch(getFixtures(competition._id,
          competition.currentMatchday));
      }/*,
      refreshStatus: {
        ...fixtures['refresh']
      }*/
    };

    return (
      <div>
        <Header competition={ competition } 
          fetchStatus={ fetchStatus }
          getNext={ this.getNextMatchdayFixtures }
          getPrevious={ this.getPreviousMatchdayFixtures }
          refreshFixtures={ this.refreshFixtures } />
        {
          (!fetchStatus['isProcessing'] && !fetchStatus['error'])?
            <FixturesList 
              fixtures={ fixtures[competition.currentMatchday]['value'] } 
              teams={ teams['value'] }
              preferences={ preferences }/>
            : null
        }
        <ListGroupItem />
      </div>
    );
  }
}
PerCompetitionFixturesList.contextTypes = {
  store: React.PropTypes.object
};
PerCompetitionFixturesList.propTypes = {
  competition: React.PropTypes.object.isRequired,
  preferences: React.PropTypes.object.isRequired
};

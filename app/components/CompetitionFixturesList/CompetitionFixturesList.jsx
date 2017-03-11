import React from 'react';

import Row from 'react-bootstrap/lib/Row';
import ListGroup from 'react-bootstrap/lib/ListGroup';

import FetchStatus from './FetchStatus';
import PerCompetitionFixturesList from './PerCompetitionFixturesList';

import { getCompetitions } from '../../redux/modules/competitions';
import { getAllPreferences } from '../../redux/modules/preferences';

import CompetitionFixturesListCss from './CompetitionFixturesList.css';



export default class CompetitionFixturesList extends React.Component {
  componentWillMount() {
    const { store } = this.context;
    store.dispatch(getCompetitions());
    store.dispatch(getAllPreferences());
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
    const router = this.props.router;
    const competitions = store.getState()['competitions'];
    const preferences = store.getState()['preferences'];

    const fetchStatus = {
      isProcessing: (competitions['isProcessing'] || 
        preferences['isProcessing']) ? true : false,
      error: (competitions['error'] || 
        preferences['error'] || 
        (preferences['value'] && 
          Object.keys(preferences['value']).length == 0)) ? true : false,
      onButtonClick: function() {
        router.push('/editPreferences');
      }
    };

    if (fetchStatus['isProcessing'] || fetchStatus['error']) {
      return <FetchStatus { ...fetchStatus } />;
    }
    return (
      <Row>
        <ListGroup componentClass='div'>
        {
          Object.keys(preferences['value']).map((competitionId) => {
            return (
              <PerCompetitionFixturesList 
                competition={ competitions['value'][competitionId] }
                preferences={ preferences['value'][competitionId] }
                key={ competitionId } />
            );
          })
        }
        </ListGroup>
      </Row>
    );
  }
}
CompetitionFixturesList.contextTypes = {
  store: React.PropTypes.object
};

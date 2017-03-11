import React from 'react';

import ListGroup from 'react-bootstrap/lib/ListGroup';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

import Competition from './Competition';
import Team from './Team';
import TeamListModal from './TeamListModal';
import FetchStatus from './FetchStatus';

import { getCompetitions } from '../../redux/modules/competitions';
import { getTeams } from '../../redux/modules/teams';
import {
  getAllPreferences,
  saveTeamsPreferencesByCompetition
} from '../../redux/modules/preferences';

import CompetitionListCss from './CompetitionList.css';



export default class CompetitionList extends React.Component { 
  constructor() {
    super();
    this.state = {
      showModal: false,
      selectedTeams: {}
    };
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this.tooglePreference = this.tooglePreference.bind(this);
    this.savePreferences = this.savePreferences.bind(this);
    this.selectAllCheckboxes = this.selectAllCheckboxes.bind(this);
    this.deselectAllCheckboxes = this.deselectAllCheckboxes.bind(this);
  }
  closeModal() {
    const { store } = this.context;
    const preferences = store.getState()['preferences']['value'];
    const teams = store.getState()['teams'];
    if ((preferences[this.state['currentCompetitionId']] && 
        preferences[this.state['currentCompetitionId']]['saveInProgress']) ||
        teams[this.state['currentCompetitionId']]['isProcessing']) {
      return; //don't close if save_preference OR fetch_teams is in progress
    }
    this.setState({
      showModal: false,
      selectedTeams: {},
      currentCompetitionId: null
    });
  }
  openModal(currentCompetitionId) {
    const { store } = this.context;
    const preferences = store.getState()['preferences']['value'];
    store.dispatch(getTeams(currentCompetitionId));

    let selectedTeams = {};
    if (preferences && preferences[currentCompetitionId]) {
      selectedTeams = {
        ...preferences[currentCompetitionId]
      }
    }

    this.setState({
      showModal: true,
      selectedTeams,
      currentCompetitionId
    });
  }
  tooglePreference(teamId) {
    if (this.state['selectedTeams'][teamId]) {
      delete this.state['selectedTeams'][teamId];
      this.setState({
        selectedTeams:{
          ...this.state['selectedTeams']
        }
      });
    } else {
      this.setState({
        selectedTeams:{
          ...this.state['selectedTeams'],
          [teamId]: true
        }
      });
    }
  }
  savePreferences() {
    const { store } = this.context;
    store.dispatch(saveTeamsPreferencesByCompetition(
      this.state['currentCompetitionId'],
      this.state['selectedTeams']
    ));
  }
  selectAllCheckboxes() {
    const { store } = this.context;
    const teams = store.getState()['teams'][this.state['currentCompetitionId']];
    const teamIdsArray = (teams['value']) ? Object.keys(teams['value']) : [];

    this.setState({
      selectedTeams: teamIdsArray.reduce((acc, teamId) => {
        acc[teamId] = true;
        return acc;
      }, {})
    });
  }
  deselectAllCheckboxes(){
    this.setState({
      selectedTeams: {}
    });
  }

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
    const competitions = store.getState()['competitions'];
    const preferences = store.getState()['preferences'];
    const teams = store.getState()['teams'];

    const currentCompetitionId = this.state['currentCompetitionId'];
    let currentTeams = null;

    if (currentCompetitionId) {
       currentTeams = teams[currentCompetitionId]['value'];
    }

    const competitionFetchStatus = {
      isProcessing: (competitions['isProcessing'] ||
        preferences['isProcessing']) ? true: false,
      error: (competitions['error'] ||
        preferences['error']) ? true : false,
      onButtonClick: function() {
        store.dispatch(getCompetitions());
      },
      errorText: "No Competition Available",
      btnText: "Fetch Competitions"
    };
    const teamsFetchStatus = {
      isProcessing: (currentCompetitionId && 
        teams[currentCompetitionId]['isProcessing']) ? true: false,
      error: (!currentCompetitionId ||
        teams[currentCompetitionId]['error']) ? true: false,
      onButtonClick: function() {
        store.dispatch(getTeams(currentCompetitionId));
      },
      errorText: "No Teams Available",
      btnText: "Fetch Teams"
    };

    if (competitionFetchStatus.isProcessing || 
        competitionFetchStatus.error) {
      return (
        <div>
          <br />
          <FetchStatus { ...competitionFetchStatus } />
        </div>
      );
    }

    return (
      <Row>
        <ListGroup>
          {
            Object.keys(competitions['value']).map((competitionId) => {
              return (
                <Competition 
                  competition={ competitions['value'][competitionId] } 
                  onSelectTeamBtnClick={ this.openModal }
                  key={ competitionId } />
              );
            })
          }
          <TeamListModal showModal={ this.state.showModal } 
            closeModal={ this.closeModal }
            savePreferences={ this.savePreferences }
            selectAllCheckboxes={ this.selectAllCheckboxes }
            deselectAllCheckboxes={ this.deselectAllCheckboxes } >
            {
              (!this.state.showModal)? null :
                (<Row>
                  <Col mdOffset={2} md={8}>
                    <ListGroup>
                    {(teamsFetchStatus.isProcessing || teamsFetchStatus.error)?
                      null :
                      (Object.keys(currentTeams).map((teamId) => {
                        const that = this;
                        return (
                          <Team team={ currentTeams[teamId] }
                            preferences={ this.state.selectedTeams }
                            key={ teamId }
                            teamId={ teamId }
                            onCheckboxClick={ () => {
                              that.tooglePreference(teamId)
                            }} />
                        )
                      }))
                    }
                    </ListGroup>
                  </Col>
                </Row>)
            }
            <FetchStatus { ...teamsFetchStatus } />
          </TeamListModal>
        </ListGroup>
      </Row>
    );
  }
}
CompetitionList.contextTypes = {
  store: React.PropTypes.object
};

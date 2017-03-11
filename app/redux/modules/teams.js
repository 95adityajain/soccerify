import * as Utility from '../utility';
import Promise from 'bluebird';



//ACTION TYPE
export const FETCH_TEAMS = 'soccerify/teams/FETCH_TEAMS';
export const TEAMS_ALREADY_PRESENT = 'soccerify/teams/TEAMS_ALREADY_PRESENT';
export const FETCH_TEAMS_SUCCESS = 'soccerify/teams/FETCH_TEAMS_SUCCESS';
export const FETCH_TEAMS_FAILURE = 'soccerify/teams/FETCH_TEAMS_FAILURE';

//Initial State
const intialState = {};

//REDUCER
export default function reducer(state = intialState, action) {
  switch(action.type) {
    case FETCH_TEAMS:
      if (state[action.competitionId]) {
        delete state[action.competitionId]['error'];
      }
      return {
        ...state,
        [action.competitionId]: {
          ...state[action.competitionId],
          isProcessing: true
        }
      };
    case TEAMS_ALREADY_PRESENT:
      return {
        ...state,
        [action.competitionId]: {
          ...state[action.competitionId],
          isProcessing: false
        }
      };
    case FETCH_TEAMS_SUCCESS:
      return {
        ...state,
        [action.competitionId]: {
          isProcessing: false,
          value: action.teams
        }
      };
    case FETCH_TEAMS_FAILURE:
      return {
        ...state,
        [action.competitionId]: {
          isProcessing: false,
          error: true
        }
      };
    default:
      return state;
  }
}

//ACTION CREATORS
export const fetchTeams = (competitionId) => {
  return {
    type: FETCH_TEAMS,
    competitionId
  };
};
export const fetchTeamsSuccess = (competitionId, teams) => {
  return {
    type: FETCH_TEAMS_SUCCESS,
    competitionId,
    teams
  };
};
export const fetchTeamsFailure = (competitionId) => {
  return {
    type: FETCH_TEAMS_FAILURE,
    competitionId
  };
};
export const teamsAlreadyPresent = (competitionId) => {
  return {
    type: TEAMS_ALREADY_PRESENT,
    competitionId
  };
};
export const getTeams = (competitionId) => {
  return function(dispatch, getState) {
    dispatch(fetchTeams(competitionId));

    if (shouldNotFetch(getState()['teams'], competitionId)) {
      dispatch(teamsAlreadyPresent(competitionId));
      return Promise.resolve();
    }

    return Utility.getTeams(competitionId).then((teams) => {
      ifRecievedTeamsInvalidThenThrowError(teams);
      return teams.reduce((acc, team) => {
        const extractedId = team._id.split("/")[2];
        acc[extractedId] = team;
        return acc;
      }, {});
    }).then((teams) => {
      dispatch(fetchTeamsSuccess(competitionId, teams));
    }).catch((err) => {
      dispatch(fetchTeamsFailure(competitionId));
    });
  }
};

//HELPERS
const shouldNotFetch = (state,competitionId) => {
  return state[competitionId] && state[competitionId]['value'];
};
const ifRecievedTeamsInvalidThenThrowError = (teams) => {
  if (!teams || !teams.length || teams.length == 0) {
    throw Error();
  }
}

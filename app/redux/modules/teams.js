import Utility from '../utility';
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

    const state = getState()['teams'];
    if (state[competitionId] && state[competitionId]['value']) {
      dispatch(teamsAlreadyPresent(competitionId));
      return Promise.resolve();
    }

    return Utility.getTeams(competitionId).then((teams) => {
      if (!teams || !teams.length || teams.length == 0) {
        throw Error();
      } else {
        dispatch(fetchTeamsSuccess(competitionId, teams));
      }
    }).catch(() => {
      dispatch(fetchTeamsFailure(competitionId));
    });
  }
};

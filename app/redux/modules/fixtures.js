import Utility from '../utility';
import Promise from 'bluebird';



//ACTION TYPE
export const FETCH_FIXTURES =
  'soccerify/fixtures/FETCH_FIXTURES';
export const FIXTURES_ALREADY_PRESENT =
  'soccerify/fixtures/FIXTURES_ALREADY_PRESENT';
export const FETCH_FIXTURES_SUCCESS =
  'soccerify/fixtures/FETCH_FIXTURES_SUCCESS';
export const FETCH_FIXTURES_FAILURE =
  'soccerify/fixtures/FETCH_FIXTURES_FAILURE';
export const REFRESH_FIXTURES =
  'soccerify/fixtures/REFRESH_FIXTURES'; 
export const REFRESH_FIXTURES_SUCCESS =
  'soccerify/fixtures/REFRESH_FIXTURES_SUCCESS';
export const REFRESH_FIXTURES_FAILURE =
  'soccerify/fixtures/REFRESH_FIXTURES_FAILURE';

//Initial State
const intialState = {};

//REDUCER
export default function reducer(state = intialState, action) {
  switch(action.type) {
    case FETCH_FIXTURES:
      const currentCompetitionObject = state[action.competitionId] || {};
      return {
        ...state,
        [action.competitionId]: {
          ...currentCompetitionObject,
          [action.matchDay]: {
            ...currentCompetitionObject[action.matchDay],
            isProcessing: true
          }
        }
      };
    case FIXTURES_ALREADY_PRESENT:
      return {
        ...state,
        [action.competitionId]: {
          ...state[action.competitionId],
          [action.matchDay]: {
            ...state[action.competitionId][action.matchDay],
            isProcessing: false
          }
        }
      };
    case FETCH_FIXTURES_SUCCESS:
      return {
        ...state,
        [action.competitionId]: {
          ...state[action.competitionId],
          [action.matchDay]: {
            isProcessing: false,
            value: action.fixtures
          }
        }
      };
    case FETCH_FIXTURES_FAILURE:
      return {
        ...state,
        [action.competitionId]: {
          ...state[action.competitionId],
          [action.matchDay]: {
            isProcessing: false,
            error: true
          }
        }
      };
    case REFRESH_FIXTURES:
      return {
        ...state,
        [action.competitionId]: {
          ...state[action.competitionId],
          ["refresh"]: {
            isProcessing: true
          }
        }
      };
      case REFRESH_FIXTURES_SUCCESS:
      return {
        ...state,
        [action.competitionId]: {
          ["refresh"]: {
            isProcessing: false,
            showStatus: true,
          },
          [action.matchDay]: {
            isProcessing: false,
            value: action.fixtures
          }
        }
      };
    case REFRESH_FIXTURES_FAILURE:
      return {
        ...state,
        [action.competitionId]: {
          ...state[action.competitionId],
          ["refresh"]: {
            isProcessing: false,
            showStatus: true,
            error: true
          }
        }
      };
    default:
      return state;
  }
}

//ACTION CREATORS
export const fetchFixtures = (competitionId, matchDay) => {
  return {
    type: FETCH_FIXTURES,
    competitionId,
    matchDay
  };
};
export const fetchFixturesSuccess = (competitionId, matchDay, fixtures) => {
  return {
    type: FETCH_FIXTURES_SUCCESS,
    competitionId,
    matchDay,
    fixtures
  };
};
export const fetchFixturesFailure = (competitionId, matchDay) => {
  return {
    type: FETCH_FIXTURES_FAILURE,
    competitionId,
    matchDay
  };
};
export const fixturesAlreadyPresent = (competitionId, matchDay) => {
  return {
    type: FIXTURES_ALREADY_PRESENT,
    competitionId,
    matchDay
  };
};
export const refreshFixtures = (competitionId, matchDay) => {
  return {
    type: REFRESH_FIXTURES,
    competitionId,
    matchDay
  };
};
export const refreshFixturesSuccess = (competitionId, matchDay, fixtures) => {
  return {
    type: REFRESH_FIXTURES_SUCCESS,
    competitionId,
    matchDay,
    fixtures
  };
};
export const refreshFixturesFailure = (competitionId, matchDay) => {
  return {
    type: REFRESH_FIXTURES_FAILURE,
    competitionId,
    matchDay
  };
};
export const getFixtures = (competitionId, matchDay) => {
  return function(dispatch, getState) {
    dispatch(fetchFixtures(competitionId, matchDay));

    if (shouldNotFetch(getState()['fixtures'][competitionId], matchDay)) {
      dispatch(fixturesAlreadyPresent(competitionId, matchDay));
      return Promise.resolve();
    }

    return Utility.getFixtures(competitionId, matchDay).then((fixtures) => {
      ifRecievedFixturesInvalidThenThrowError(fixtures);
      dispatch(fetchFixturesSuccess(competitionId, matchDay, fixtures));
    }).catch(() => {
      dispatch(fetchFixturesFailure(competitionId, matchDay));
    });
  };
};
export const refreshAndGetFixtures = (competitionId, matchDay) => {
  return function(dispatch, getState) {
    if (shouldNotRefresh(getState()['fixtures'][competitionId], matchDay)) {
      return Promise.resolve();
    }
    dispatch(refreshFixtures(competitionId, matchDay));

    return Utility.refreshAndGetFixtures(competitionId, matchDay).then((fixtures) => {
      ifRecievedFixturesInvalidThenThrowError(fixtures);
      dispatch(refreshFixturesSuccess(competitionId, matchDay, fixtures));
    }).catch(() => {
      dispatch(refreshFixturesFailure(competitionId, matchDay));
    });
  };
};

//HELPERS
const ifRecievedFixturesInvalidThenThrowError = (fixtures) => {
  if (!fixtures || !fixtures.length || fixtures.length == 0) {
    throw Error();
  }
};
const shouldNotRefresh = (state, matchDay) => {
  //if already refershing OR not fetched at all.
  return (!state || !state[matchDay] ||
    (state['refresh'] && state['refresh']['isProcessing']));
};
const shouldNotFetch = (state, matchDay) => {
  return (state && state[matchDay] && state[matchDay]['value']);
};

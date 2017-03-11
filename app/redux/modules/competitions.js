import * as Utility from '../utility';
import Promise from 'bluebird';

//ACTION TYPE
export const FETCH_COMPETITIONS =
  'soccerify/competitions/FETCH_COMPETITIONS';
export const FETCH_COMPETITIONS_SUCCESS =
  'soccerify/competitions/FETCH_COMPETITIONS_SUCCESS';
export const COMPETITIONS_ALREADY_PRESENT =
  'soccerify/competitions/COMPETITIONS_ALREADY_PRESENT';
export const FETCH_COMPETITIONS_FAILURE =
  'soccerify/competitions/FETCH_COMPETITIONS_FAILURE';
export const UPDATE_COMPETITONS_CURRENT_MATCHDAY =
  'soccerify/competitions/UPDATE_COMPETITONS_CURRENT_MATCHDAY';

//Initial State
const intialState = {
  isProcessing: false
};

//REDUCER
export default function reducer(state = intialState, action) {
  switch(action.type) {
    case FETCH_COMPETITIONS:
      delete state['error'];
      return {
        ...state,
        isProcessing: true,
      };
    case COMPETITIONS_ALREADY_PRESENT:
      return {
        ...state,
        isProcessing: false,
      };
    case FETCH_COMPETITIONS_SUCCESS:
      return {
        isProcessing: false,
        value: {
          ...action.competitions
        }
      };
    case FETCH_COMPETITIONS_FAILURE:
      return {
        isProcessing: false,
        error: true
      };
    case UPDATE_COMPETITONS_CURRENT_MATCHDAY:
      return {
        ...state,
        ['value']: {
          ...state['value'],
          [action.competitionId]: {
            ...state['value'][action.competitionId],
            currentMatchday: action.newCurrentMatchday
          }
        }
      }
    default:
      return state;
  }
}

//ACTION CREATORS
export const fetchCompetitions = () => {
  return {
    type: FETCH_COMPETITIONS
  };
};
export const fetchCompetitionsSuccess = (competitions) => {
  return {
    type: FETCH_COMPETITIONS_SUCCESS,
    competitions
  };
};
export const fetchCompetitionsFailure = () => {
  return {
    type: FETCH_COMPETITIONS_FAILURE
  };
};
export const competitionsAlreadyPresent = () => {
  return {
    type: COMPETITIONS_ALREADY_PRESENT
  };
};
export const updateCompetitionsCurrentMatchday = (
  competitionId,
  newCurrentMatchday) => {
  return {
    type: UPDATE_COMPETITONS_CURRENT_MATCHDAY,
    competitionId,
    newCurrentMatchday
  }
};
export const getCompetitions = () => {
  return function(dispatch, getState) {
    dispatch(fetchCompetitions());

    if (shouldNotFetch(getState()["competitions"])) {
      dispatch(competitionsAlreadyPresent());
      return Promise.resolve();
    }

    return Utility.getCompetitions().then((competitions) => {
      ifRecievedCompetitionsInvalidThenThrowError(competitions);
      return competitions.reduce((acc, competition) => {
        acc[competition._id] = competition;
        return acc;
      }, {});
    }).then((competitions) => {
      dispatch(fetchCompetitionsSuccess(competitions));
    }).catch((err) => {
      dispatch(fetchCompetitionsFailure());
    });
  }
};

//HELPERS
const shouldNotFetch = (state) => {
  return state && state['value'];
};
const ifRecievedCompetitionsInvalidThenThrowError = (competitions) => {
  if(!competitions || !competitions.length || competitions.length == 0) {
    throw Error();
  }
};

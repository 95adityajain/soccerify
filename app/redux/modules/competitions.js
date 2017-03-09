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

//Initial State
const intialState = {
  isProcessing: false
};

//REDUCER
export default function reducer(state = intialState, action) {
  switch(action.type) {
    case FETCH_COMPETITIONS:
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
          ...action.data
        }
      };
    case FETCH_COMPETITIONS_FAILURE:
      return {
        isProcessing: false,
        error: true
      };
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
export const fetchCompetitionsSuccess = (data) => {
  return {
    type: FETCH_COMPETITIONS_SUCCESS,
    data
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
export const getCompetitions = () => {
  return function(dispatch, getState) {
    dispatch(fetchCompetitions());

    if (getState()["competitions"]["value"]) {
      dispatch(competitionsAlreadyPresent());
      return Promise.resolve();
    }

    return Utility.getCompetitions().then((competitions) => {
      if (!competitions || !competitions.length || competitions.length == 0) {
        throw Error();
      }
      return competitions.reduce((acc, competition) => {
        acc[competition._id] = competition;
        delete acc[competition._id]['_id'];
        return acc;
      }, {});
    }).then((competitions) => {
      dispatch(fetchCompetitionsSuccess(competitions));
    }).catch(() => {
      dispatch(fetchCompetitionsFailure());
    });
  }
};

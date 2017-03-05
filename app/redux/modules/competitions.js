import Utility from '../utility';



//ACTION TYPE
export const FETCH_COMPETITIONS = 'soccerify/competition/FETCH_COMPETITIONS';
export const FETCH_COMPETITIONS_SUCCESS = 'soccerify/competition/FETCH_COMPETITIONS_SUCCESS';
export const FETCH_COMPETITIONS_FAILURE = 'soccerify/competition/FETCH_COMPETITIONS_FAILURE';

//Initial State
const intialState = {
  processed: false
};

//REDUCER
export default function reducer(state = intialState, action) {
  switch(action.type) {
    case FETCH_COMPETITIONS:
      return {
        processed: false,
        isProcessing: true
      };
    case FETCH_COMPETITIONS_SUCCESS:
      return {
        processed: true,
        isProcessing: false,
        value: {
          ...action.data
        }
      };
    case FETCH_COMPETITIONS_FAILURE:
      return {
        processed: true,
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
export const getCompetitions = () => {
  return function(dispatch) {
    dispatch(fetchCompetitions());

    return Utility.getCompetitions().then((competitions) => {
      if (!competitions || Object.keys(competitions).length == 0) {
        dispatch(fetchCompetitionsFailure());
      } else {
        dispatch(fetchCompetitionsSuccess(competitions));
      }
    }).catch(() => {
      dispatch(fetchCompetitionsFailure());
    });
  }
};

import Utility from '../utility';
import Promise from 'bluebird';



// ACTION TYPES
export const FETCH_ALL_PREFERENCES =
  'soccerify/preferences/FETCH_ALL_PREFERENCES';
export const PREFERENCES_ALREADY_PRESENT =
  'soccerify/preferences/PREFERENCES_ALREADY_PRESENT'
export const FETCH_ALL_PREFERENCES_SUCCESS =
  'soccerify/preferences/FETCH_ALL_PREFERENCES_SUCCESS';
export const FETCH_ALL_PREFERENCES_FAILURE =
  'soccerify/preferences/FETCH_ALL_PREFERENCES_FAILURE';
export const SAVE_TEAMS_PREFERENCES =
  'soccerify/preferences/SAVE_TEAMS_PREFERENCES';
export const SAVE_TEAMS_PREFERENCES_SUCCESS =
  'soccerify/preferences/SAVE_TEAMS_PREFERENCES_SUCCESS';
export const SAVE_TEAMS_PREFERENCES_FAILURE =
  'soccerify/preferences/SAVE_TEAMS_PREFERENCES_FAILURE';

//INTIAL STATE
const initialState = {
  isProcessing: false
};

//REDUCER
export default function reducer(state = initialState, action) {
  switch(action.type) {
    case FETCH_ALL_PREFERENCES:
      return {
        ...state,
        isProcessing: true
      };
    case PREFERENCES_ALREADY_PRESENT:
      return {
        ...state,
        isProcessing: false
      };
    case FETCH_ALL_PREFERENCES_SUCCESS:
      return {
        isProcessing: false,
        value: {
          ...action.preferences
        }
      };
    case FETCH_ALL_PREFERENCES_FAILURE:
      return {
        isProcessing: false,
        error: true
      };
    case SAVE_TEAMS_PREFERENCES:
      return {
        ...state,
        [action.competitionId]: {
          ...state[action.competitionId],
          saveInProgress: true
        }
      };
    case SAVE_TEAMS_PREFERENCES_SUCCESS:
      return {
        ...state,
        [action.competitionId]: {
          ...action.preferences,
          saveInProgress: false
        }
      };
    case SAVE_TEAMS_PREFERENCES_FAILURE:
      return {
        ...state,
        [action.competitionId]: {
          ...state[action.competitionId],
          saveInProgress: false,
          saveError: true
        }
      };
    default:
      return state;
  }
}

//ACTION CREATORS
export const fetchAllPreferences = () => {
  return {
    type: FETCH_ALL_PREFERENCES
  }
};
export const preferencesAlreadyPresent = () => {
  return {
    type: PREFERENCES_ALREADY_PRESENT
  };
};
export const fetchAllPreferencesSuccess = (preferences) => {
  return {
    type: FETCH_ALL_PREFERENCES_SUCCESS,
    preferences
  };
};
export const fetchAllPreferencesFailure = () => {
  return {
    type: FETCH_ALL_PREFERENCES_FAILURE
  }
};
export const saveTeamsPreferences = (competitionId) => {
  return {
    type: SAVE_TEAMS_PREFERENCES,
    competitionId
  };
};
export const saveTeamsPreferencesSuccess = (competitionId, preferences) => {
  return {
    type: SAVE_TEAMS_PREFERENCES_SUCCESS,
    competitionId,
    preferences
  };
};
export const saveTeamsPreferencesFailure = (competitionId) => {
  return {
    type: SAVE_TEAMS_PREFERENCES_FAILURE,
    competitionId
  };
};
export const getAllPreferences = () => {
  return function(dispatch, getState) {
    dispatch(fetchAllPreferences());

    if(shouldNotFetchAllPreferences(getState()['preferences'])){
      dispatch(preferencesAlreadyPresent());
      return Promise.resolve();
    }

    return Utility.getAllPreferences().then((preferences) => {
      ifRecievedPreferencesInvalidThenThrowError(preferences);
      dispatch(fetchAllPreferencesSuccess(preferences));
    }).catch(() => {
      dispatch(fetchAllPreferencesFailure());
    });
  };
};
export const saveTeamsPreferencesByCompetition = (competitionId, preferences) => {
  return function(dispatch, getState) {
    if (isSaveAlreadyInProgress(getState()['preferences'], competitionId)) {
      return Promise.resolve();
    }

    dispatch(saveTeamsPreferences(competitionId));
    return Utility.saveTeamsPreferencesByCompetition(competitionId, preferences)
      .then(() => {
        dispatch(saveTeamsPreferencesSuccess(competitionId, preferences));
      }).catch(() => {
        dispatch(saveTeamsPreferencesFailure(competitionId));
      });
  }
};

//HELPERS
const shouldNotFetchAllPreferences = (state) => {
  return state['value'];
};
const ifRecievedPreferencesInvalidThenThrowError = (preferences) => {
  if(!preferences){
    throw Error();
  }
};
const isSaveAlreadyInProgress = (state, competitionId) => {
  return state[competitionId] && state[competitionId]['saveInProgress'];
};

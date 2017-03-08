jest.mock('../../utility');

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as PreferenceDuck from '../preferences';



describe("Preference Duck", () => {
  let intialState;
  let mockStore;
  let reducer;
  let competitionId;

  beforeAll(() => {
    mockStore = configureMockStore([ thunk ]);
    reducer = PreferenceDuck.default;
    competitionId = 'comp1';
  });

  beforeEach(() => {
    intialState = {
      isProcessing: false
    };
  });

  it("should handle fetchAllPreferences Action", () => {
    const expectedState = {
      isProcessing: true
    };

    expect(reducer(intialState, PreferenceDuck.fetchAllPreferences()))
      .toEqual(expectedState);
  });

  it("should handle fetchAllPreferencesSuccess Action", () => {
    const preferences = {
      'comp1': {
        'team1': true
      }
    };
    const expectedState = {
      isProcessing: false,
      value: preferences
    };

    expect(reducer(intialState,
      PreferenceDuck.fetchAllPreferencesSuccess(preferences)))
      .toEqual(expectedState);
  });

  it("should handle preferencesAlreadyPresent Action", () => {
    const preferences = {
      'comp1': {
        'team1': true
      }
    };
    const expectedState = {
      isProcessing: false,
      value: preferences
    };

    let newState = reducer(intialState,
      PreferenceDuck.fetchAllPreferencesSuccess(preferences));

    expect(reducer(newState, PreferenceDuck.preferencesAlreadyPresent()))
      .toEqual(expectedState);
  });

  it("should handle fetchAllPreferencesFailure Action", () => {
    const expectedState = {
      isProcessing: false,
      error: true
    };

    expect(reducer(intialState,
      PreferenceDuck.fetchAllPreferencesFailure())).toEqual(expectedState);
  });

  it("should handle saveTeamsPreferences Action", () => {
    const preferences = {
      'comp1': {
        'team1': true
      }
    };
    const expectedState = {
      'isProcessing': false,
      'comp1': {
        saveInProgress: true
      }
    };

    expect(reducer(intialState,
      PreferenceDuck.saveTeamsPreferences(competitionId, preferences)))
      .toEqual(expectedState);
  });

  it("should handle saveTeamsPreferencesSuccess Action", () => {
    const preferences = {
      'team1': true
    };
    const expectedState = {
      isProcessing: false,
      'comp1': {
        saveInProgress: false,
        ...preferences
      }
    };

    expect(reducer(intialState,
      PreferenceDuck.saveTeamsPreferencesSuccess(competitionId, preferences)))
      .toEqual(expectedState);
  });

  it("should handle saveTeamsPreferencesFailure Action", () => {
    const expectedState = {
      isProcessing: false,
      'comp1': {
        saveInProgress: false,
        saveError:true
      }
    };

    expect(reducer(intialState,
      PreferenceDuck.saveTeamsPreferencesFailure(competitionId)))
      .toEqual(expectedState);
  });

  it(`saveTeamsPreferencesByCompetition Async Action should 
    dispatch saveTeamsPreferencesSuccess`, () => {
    const preferences = {
      'team1': true
    };
    const expectedActions = [{
        type: PreferenceDuck.SAVE_TEAMS_PREFERENCES,
        competitionId
      },
      { 
        type: PreferenceDuck.SAVE_TEAMS_PREFERENCES_SUCCESS,
        competitionId,
        preferences
    }];
    const store = mockStore({preferences: intialState});

    return store.dispatch(
      PreferenceDuck.saveTeamsPreferencesByCompetition(
      competitionId, preferences)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it(`saveTeamsPreferencesByCompetition Async Action should not 
    dispatch any action when save is in progress`, () => {
    const preferences = {
      'team1': true
    };
    const expectedActions = [];

    intialState[competitionId] = {
      saveInProgress: true
    };
    const store = mockStore({preferences: intialState});

    return store.dispatch(
      PreferenceDuck.saveTeamsPreferencesByCompetition(
      competitionId, preferences)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it(`getAllPreferences Async Action should 
    dispatch fetchCompetitionsSuccess`, () => {
    const expectedActions = [{
        type: PreferenceDuck.FETCH_ALL_PREFERENCES
      },
      { 
        type: PreferenceDuck.FETCH_ALL_PREFERENCES_SUCCESS, 
        preferences: {
          'comp1': {
            'team1': true
          }
        }
    }];
    const store = mockStore({preferences: intialState});

    return store.dispatch(PreferenceDuck.getAllPreferences()).then(() => {
      expect(store.getActions()).toEqual(expectedActions)
    });
  });

  it(`getAllPreferences Async Action should 
    dispatches preferencesAlreadyPresent`, () => {
    const expectedActions = [{
        type: PreferenceDuck.FETCH_ALL_PREFERENCES
      },
      { 
        type: PreferenceDuck.PREFERENCES_ALREADY_PRESENT, 
    }];
    intialState["value"] = {
      'comp1': {
        'team1': true
      }
    };
    const store = mockStore({preferences: intialState});

    return store.dispatch(PreferenceDuck.getAllPreferences()).then(() => {
      expect(store.getActions()).toEqual(expectedActions)
    });
  });
});

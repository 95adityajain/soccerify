jest.mock('../../utility');

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as FixtureDuck from '../fixtures';
import { UPDATE_COMPETITONS_CURRENT_MATCHDAY } from '../competitions';



describe("Fixture Duck", () => {
  let intialState;
  let mockStore;
  let reducer;
  let competitionId;
  let matchDay;

  beforeAll(() => {
    mockStore = configureMockStore([ thunk ]);
    reducer = FixtureDuck.default;
    competitionId = 'comp1';
    matchDay = 23;
  });

  beforeEach(() => {
    intialState = {};
  });

  it("should handle fetchFixtures Action", () => {
    const expectedState = {
      [competitionId]: {
        [matchDay]: {
          isProcessing: true
        }
      }
    };

    expect(reducer(intialState,
      FixtureDuck.fetchFixtures(competitionId, matchDay)))
      .toEqual(expectedState);
  });

  it("should handle fetchFixturesSuccess Action", () => {
    const fixtures = [{
      '_id': 1234
    }];
    const expectedState = {
      [competitionId]: {
        [matchDay]: {
          isProcessing: false,
          value: fixtures
        }
      }
    };

    expect(reducer(intialState,
      FixtureDuck.fetchFixturesSuccess(competitionId, matchDay, fixtures)))
      .toEqual(expectedState);
  });

  it("should handle fixturesAlreadyPresent Action", () => {
    const fixtures = [{
      '_id': 1234
    }];
    const expectedState = {
      [competitionId]: {
        [matchDay]: {
          isProcessing: false,
          value: fixtures
        }
      }
    };
    let newState = reducer(intialState,
      FixtureDuck.fetchFixturesSuccess(competitionId, matchDay, fixtures));

    expect(reducer(newState, 
      FixtureDuck.fixturesAlreadyPresent(competitionId, matchDay)))
      .toEqual(expectedState);
  });

  it("should handle fetchFixturesFailure Action", () => {
    const expectedState = {
      [competitionId]: {
        [matchDay]: {
          isProcessing: false,
          error: true
        }
      }
    };

    expect(reducer(intialState,
      FixtureDuck.fetchFixturesFailure(competitionId, matchDay)))
      .toEqual(expectedState);
  });

  it("should handle refreshFixtures Action", () => {
    const expectedState = {
      [competitionId]: {
        [matchDay]: {
          isProcessing: false
        },
        ["refresh"]: {
          isProcessing: true
        }
      }
    };
    const intialState = {
      [competitionId]: {
        [matchDay]: {
          isProcessing: false
        }
      }
    };

    expect(reducer(intialState, 
      FixtureDuck.refreshFixtures(competitionId, matchDay)))
      .toEqual(expectedState);
  });

  it("should handle refreshFixturesSuccess Action", () => {
    const refreshedFixtures = [{
      '_id': 4321
    }];
    const expectedState = {
      [competitionId]: {
        [matchDay]: {
          isProcessing: false,
          value: refreshedFixtures
        },
        ["refresh"]: {
          isProcessing: false,
          showStatus: true,
        }
      }
    };
    const intialState = {
      [competitionId]: {
        [matchDay]: {
          isProcessing: false,
          value: [{
            '_id': 1234
          }]
        }
      }
    };

    expect(reducer(intialState, 
      FixtureDuck.refreshFixturesSuccess(competitionId, 
        matchDay, refreshedFixtures)))
        .toEqual(expectedState);
  });

  it("should handle refreshFixturesFailure Action", () => {
    const fixtures = [{
      '_id': 1234
    }];
    const expectedState = {
      [competitionId]: {
        [matchDay]: {
          isProcessing: false,
          value: fixtures
        },
        ["refresh"]: {
          isProcessing: false,
          showStatus: true,
          error: true
        }
      }
    };
    const intialState = {
      [competitionId]: {
        [matchDay]: {
          isProcessing: false,
          value: fixtures
        }
      }
    };

    expect(reducer(intialState, 
      FixtureDuck.refreshFixturesFailure(competitionId, matchDay)))
      .toEqual(expectedState);
  });

  it(`getFixtures Async Action should
    dispatch fetchFixturesSuccess`, () => {
    const expectedActions = [{
      type: FixtureDuck.FETCH_FIXTURES,
      competitionId,
      matchDay
    },
    { 
      type: FixtureDuck.FETCH_FIXTURES_SUCCESS,
      fixtures: [{
        '_id': 1234
      }],
      competitionId,
      matchDay
    },
    {
      type: UPDATE_COMPETITONS_CURRENT_MATCHDAY,
      newCurrentMatchday: matchDay,
      competitionId
    }];
    const store = mockStore({fixtures: intialState});

    return store.dispatch(FixtureDuck.getFixtures(competitionId, matchDay))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions)
      });
  });

  it(`getFixtures Async Action should 
    dispatches fixturesAlreadyPresent`, () => {
    const expectedActions = [{
      type: FixtureDuck.FETCH_FIXTURES,
      competitionId,
      matchDay
    },
    { 
      type: FixtureDuck.FIXTURES_ALREADY_PRESENT,
      competitionId,
      matchDay
    },
    {
      type: UPDATE_COMPETITONS_CURRENT_MATCHDAY,
      newCurrentMatchday: matchDay,
      competitionId
    }];
    //mocks intial state, as if teams were already present;
    intialState[competitionId] = {};
    intialState[competitionId][matchDay] = {
      isProcessing: false,
      value: [{
        '_id': 1234
      }]
    };
    const store = mockStore({fixtures: intialState});

    return store.dispatch(FixtureDuck.getFixtures(competitionId, matchDay)).then(() => {
      expect(store.getActions()).toEqual(expectedActions)
    });
  });

  it(`refreshAndGetFixtures Async Action should 
    dispatch refreshFixturesSuccess`, () => {
    const expectedActions = [{
      type: FixtureDuck.REFRESH_FIXTURES,
      competitionId,
      matchDay
    },
    {
      type: FixtureDuck.REFRESH_FIXTURES_SUCCESS,
      fixtures: [{
        '_id': 4321
      }],
      competitionId,
      matchDay
    },
    {
      type: UPDATE_COMPETITONS_CURRENT_MATCHDAY,
      newCurrentMatchday: matchDay,
      competitionId
    }];
    const intialState = {
      [competitionId]: {
        [matchDay]: {
          isProcessing: false,
          value: [{
            '_id': 1234
          }]
        }
      }
    };
    const store = mockStore({fixtures: intialState});

    return store.dispatch(FixtureDuck.refreshAndGetFixtures(
      competitionId,matchDay)).then(() => {
        expect(store.getActions()).toEqual(expectedActions)
      });
  });

  it(`refreshAndGetFixtures Async Action should not dispatch any action 
    if refershing is already in progress`, () => {
    const expectedActions = [];
    const intialState = {
      [competitionId]: {
        [matchDay]: {
          isProcessing: false,
          value: [{
            '_id': 1234
          }]
        },
        ["refresh"]: {
          "isProcessing": true
        }
      }
    };
    const store = mockStore({fixtures: intialState});

    return store.dispatch(FixtureDuck.refreshAndGetFixtures(
      competitionId,matchDay)).then(() => {
        expect(store.getActions()).toEqual(expectedActions)
      });
  });
});

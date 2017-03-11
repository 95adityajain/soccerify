jest.mock('../../utility');

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as TeamDuck from '../teams';



describe("Team Duck", () => {
  let intialState;
  let mockStore;
  let reducer;
  let competitionId;

  beforeAll(() => {
    mockStore = configureMockStore([ thunk ]);
    reducer = TeamDuck.default;
    competitionId = 'comp1';
  });

  beforeEach(() => {
    intialState = {};
  });

  it("should handle fetchTeams Action", () => {
    const expectedState = {
      [competitionId]: {
        isProcessing: true
      }
    };

    expect(reducer(intialState, TeamDuck.fetchTeams(competitionId)))
      .toEqual(expectedState);
  });

  it("should handle fetchTeamsSuccess Action", () => {
    const teams = {
      'team1': {'_id': 'teams/comp1/team1'}
    };
    const expectedState = {
      [competitionId]: {
        isProcessing: false,
        value: teams
      }
    };

    expect(reducer(intialState,
      TeamDuck.fetchTeamsSuccess(competitionId, teams)))
      .toEqual(expectedState);
  });

  it("should handle teamsAlreadyPresent Action", () => {
    const teams = {
      'team1': {'_id': 'teams/comp1/team1'}
    };
    const expectedState = {
      [competitionId]: {
        isProcessing: false,
        value: teams
      }
    };
    let newState = reducer(intialState,
      TeamDuck.fetchTeamsSuccess(competitionId, teams));

    expect(reducer(newState, TeamDuck.teamsAlreadyPresent(competitionId)))
      .toEqual(expectedState);
  });

  it("should handle fetchTeamsFailure Action", () => {
    const expectedState = {
      [competitionId]: {
        isProcessing: false,
        error: true
      }
    };

    expect(reducer(intialState,
      TeamDuck.fetchTeamsFailure(competitionId))).toEqual(expectedState);
  });

  it(`getTeams Async Action should
    dispatch fetchTeamsSuccess`, () => {
    const expectedActions = [{
      type: TeamDuck.FETCH_TEAMS,
      competitionId
    },
    { 
      type: TeamDuck.FETCH_TEAMS_SUCCESS,
      teams: {
        'team1': {'_id': 'teams/comp1/team1'}
      },
      competitionId
    }];
    const store = mockStore({teams: intialState});

    return store.dispatch(TeamDuck.getTeams(competitionId)).then(() => {
      expect(store.getActions()).toEqual(expectedActions)
    });
  });

  it(`getTeams Async Action should
    dispatches teamsAlreadyPresent`, () => {
    const expectedActions = [{
      type: TeamDuck.FETCH_TEAMS,
      competitionId
    },
    { 
      type: TeamDuck.TEAMS_ALREADY_PRESENT,
      competitionId
    }];
    //mocks intial state, as if teams were already present;
    intialState[competitionId] = {
      isProcessing: false,
      value: {
        'team1': {'_id': 'teams/comp1/team1'}
      }
    };
    const store = mockStore({teams: intialState});

    return store.dispatch(TeamDuck.getTeams(competitionId)).then(() => {
      expect(store.getActions()).toEqual(expectedActions)
    });
  });
});

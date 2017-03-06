jest.mock('../../utility');

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as CompetitionDuck from '../competitions';



describe("Competition Duck", () => {
  let intialState;
  let mockStore;
  let reducer;

  beforeAll(() => {
    mockStore = configureMockStore([ thunk ]);
    reducer = CompetitionDuck.default;
  });

  beforeEach(() => {
    intialState = {
      processed: false
    };
  });

  it("should handle fetchCompetitions Action", () => {
    const expectedState = {
      processed: false,
      isProcessing: true
    };
    expect(reducer(intialState, CompetitionDuck.fetchCompetitions()))
      .toEqual(expectedState);
  });

  it("should handle fetchCompetitionsSuccess Action", () => {
    const competitions = {
      'comp1': {},
      'comp2': {}
    };
    const expectedState = {
      processed: true,
      isProcessing: false,
      value: competitions
    };
    expect(reducer(intialState,
      CompetitionDuck.fetchCompetitionsSuccess(competitions)))
      .toEqual(expectedState);
  });

  it("should handle competitionsAlreadyPresent Action", () => {
    const competitions = {
      'comp1': {},
      'comp2': {}
    };
    const expectedState = {
      processed: true,
      isProcessing: false,
      value: competitions
    };
    let newState = reducer(intialState,
      CompetitionDuck.fetchCompetitionsSuccess(competitions));

    expect(reducer(newState, CompetitionDuck.competitionsAlreadyPresent()))
      .toEqual(expectedState);
  });

  it("should handle fetchCompetitionsFailure Action", () => {
    const expectedState = {
      processed: true,
      isProcessing: false,
      error: true
    };
    expect(reducer(intialState,
      CompetitionDuck.fetchCompetitionsFailure())).toEqual(expectedState);
  });

  it("should getCompetitions Async Action dispatch fetchCompetitionsSuccess", () => {
    const expectedActions = [
      {
        type: CompetitionDuck.FETCH_COMPETITIONS
      },
      { 
        type: CompetitionDuck.FETCH_COMPETITIONS_SUCCESS, 
        data: {
          'comp1': {},
          'comp2': {}
          }
      }
    ];
    const store = mockStore({competitions: intialState});

    return store.dispatch(CompetitionDuck.getCompetitions()).then(() => {
      expect(store.getActions()).toEqual(expectedActions)
    });
  });

  it("should getCompetitions Async Action dispatches competitionAlreadyPresent", () => {
    const expectedActions = [{
        type: CompetitionDuck.FETCH_COMPETITIONS
      },
      { 
        type: CompetitionDuck.COMPETITIONS_ALREADY_PRESENT,
      }];
    //mocks intial state, as if competitions were already present;
    intialState["value"] = {
      "comp1":{}
    };
    const store = mockStore({competitions: intialState});

    return store.dispatch(CompetitionDuck.getCompetitions()).then(() => {
      expect(store.getActions()).toEqual(expectedActions)
    });
  });
});

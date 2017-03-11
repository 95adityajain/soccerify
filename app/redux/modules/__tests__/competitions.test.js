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
      isProcessing: false
    };
  });

  it("should handle fetchCompetitions Action", () => {
    const expectedState = {
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
      isProcessing: false,
      error: true
    };
    expect(reducer(intialState,
      CompetitionDuck.fetchCompetitionsFailure())).toEqual(expectedState);
  });

  it("should handle updateCompetitionsCurrentMatchday Action", () => {
    const expectedState = {
      isProcessing: false,
      value: {
        'comp1': {
          _id: 'comp1',
          currentMatchday: 2
        }
      }
    };

    intialState['value'] = {
      'comp1': {
        _id: 'comp1',
        currentMatchday: 1
      }
    };
    expect(reducer(
      intialState,
      CompetitionDuck.updateCompetitionsCurrentMatchday('comp1', 2))
    ).toEqual(expectedState);
  });

  it(`getCompetitions Async Action should 
    dispatch fetchCompetitionsSuccess`, () => {
    const expectedActions = [{
        type: CompetitionDuck.FETCH_COMPETITIONS
      },
      { 
        type: CompetitionDuck.FETCH_COMPETITIONS_SUCCESS, 
        competitions: {
          'comp1': {_id: 'comp1'},
          'comp2': {_id: 'comp2'}
        }
    }];
    const store = mockStore({competitions: intialState});

    return store.dispatch(CompetitionDuck.getCompetitions()).then(() => {
      expect(store.getActions()).toEqual(expectedActions)
    });
  });

  it(`getCompetitions Async Action should
    dispatches competitionAlreadyPresent`, () => {
    const expectedActions = [{
        type: CompetitionDuck.FETCH_COMPETITIONS
      },
      { 
        type: CompetitionDuck.COMPETITIONS_ALREADY_PRESENT,
      }];
    //mocks intial state, as if competitions were already present;
    intialState["value"] = {
      "comp1":{_id: 'comp1'}
    };
    const store = mockStore({competitions: intialState});

    return store.dispatch(CompetitionDuck.getCompetitions()).then(() => {
      expect(store.getActions()).toEqual(expectedActions)
    });
  });
});

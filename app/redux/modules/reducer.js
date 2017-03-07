import { combineReducers } from 'redux';

import competitions from './competitions';
import teams from './teams';
import fixtures from './fixtures';



export default combineReducers({
  competitions,
  teams,
  fixtures
});

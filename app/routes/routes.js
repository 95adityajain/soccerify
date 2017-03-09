import React from 'react';
import { Router, Route, IndexRoute, IndexLink, Link, hashHistory } from 'react-router';

import LatestFixturesRoute from './LatestFixtures/LatestFixtures';
import EditPreferencesRoute from './EditPreferences/EditPreferences';



const Routes = (
  <Router history={hashHistory}>
    <Route path="/">
      <IndexRoute component={LatestFixturesRoute}/>
      <Route path="editPreferences" component={EditPreferencesRoute} />
    </Route>
  </Router>
);



export default Routes;

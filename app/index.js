import React from 'react';
import ReactDOM from 'react-dom';
import Bootstrap from 'bootstrap/dist/css/bootstrap.min.css';
import BootstrapTheme from 'bootstrap/dist/css/bootstrap-theme.min.css';

import Routes from './routes/routes';
import AppCss from './index.css';

import createStore from './redux/create';



const store = createStore();

class Provider extends React.Component {
  getChildContext() {
    return {
      store: this.props.store
    }
  }

  render() {
    return this.props.children;
  }
}

Provider.childContextTypes = {
  store: React.PropTypes.object
};

const render = () => {
  ReactDOM.render(
    <Provider store={ store }>
      <Routes />
    </Provider>,
    document.getElementById('react-app'));
};
render();

/*store.subscribe(function() {
  console.log(store.getState());
})*/

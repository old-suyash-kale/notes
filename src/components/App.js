import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { BasePath } from '../sConfig';
import Routes from './Routes.jsx';

import '../scss/style.scss';

class App extends Component {
  render() {
    return (
      <Router
        basename={BasePath}>
          <Routes />
      </Router>
    );
  }
}

export default App;
import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import Account from './components/Account';
import { AppBar } from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <div>
          <AppBar title="xx"/>
          <Account />  
        </div>
        
      </MuiThemeProvider>

    );
  }
}

export default App;

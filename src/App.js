import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import Account from './components/Account';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import createMuiTheme from 'material-ui/styles/theme'
import createPalette from 'material-ui/styles/palette'
import { grey, amber, deepOrange500 } from 'material-ui/styles/colors';
import { AppBar } from 'material-ui';

const muiTheme = createMuiTheme({
    palette: createPalette({
        primary: grey,
        accent: amber,
        accent1Color: deepOrange500,
    }),
});

class App extends Component {
    render() {
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div>
                    <AppBar title="xx" className="AppBar" />
                    <Account />
                </div>
            </MuiThemeProvider>
        );
    }
}

export default App;

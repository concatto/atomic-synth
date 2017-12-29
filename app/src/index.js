import React from 'react';
import ReactDOM from 'react-dom';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import { green, amber, teal, blueGrey } from 'material-ui/colors';
import registerServiceWorker from './registerServiceWorker';
import App from './App';
import './index.css';
import 'typeface-roboto';

const theme = createMuiTheme({
  palette: {
    primary: teal,
    secondary: blueGrey,
  }
});

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <App/>
  </MuiThemeProvider>
, document.getElementById('root'));
registerServiceWorker();

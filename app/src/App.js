import React, { Component } from 'react';
import logo from './logo.svg';
import { play, load, names } from './logic/media';
import './App.css';

class App extends Component {
  createInstruments() {
    return names.map((instrument, i) => (
      <li onClick={() => load(instrument).then(console.log)} key={i}>
        {instrument}
      </li>
    ));
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img onClick={() => play("C4")} src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <ul>
          {this.createInstruments()}
        </ul>
      </div>
    );
  }
}

export default App;

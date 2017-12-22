import React, { Component } from 'react';
import logo from './logo.svg';
import { play, release, load, names } from './logic/media';
import { indexOf } from './logic/keymap';
import { toNote } from './logic/notes';
import './App.css';

class App extends Component {
  createInstruments() {
    return names.map((instrument, i) => (
      <li onClick={() => load(instrument).then(console.log)} key={i}>
        {instrument}
      </li>
    ));
  }

  eventToNote(event) {
    return toNote(indexOf(event.key), event.shiftKey);
  }

  handlePress(e) {
    play(this.eventToNote(e));
  }

  handleRelease(e) {
    release(this.eventToNote(e));
  }

  componentDidMount() {
    document.addEventListener("keydown", e => this.handlePress(e));
    document.addEventListener("keyup", e => this.handleRelease(e));
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

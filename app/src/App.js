import React, { Component } from 'react';
import logo from './logo.svg';
import MediaController, { names } from './logic/media';
import { indexOf } from './logic/keymap';
import { toNote } from './logic/notes';
import Keyboard from './components/Keyboard';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      notes: []
    };

    this.controller = new MediaController();
    this.controller.on("changed", notes => this.setState({notes}));
    window.controller = this.controller;
  }

  createInstruments() {
    return names.map((instrument, i) => (
      <li onClick={() => this.controller.load(instrument).then(alert)} key={i}>
        {instrument}
      </li>
    ));
  }

  convertAndApply(event, func) {
    const index = indexOf(event.key);

    if (index !== undefined) {
      func(toNote(index, event.shiftKey));
    }
  }

  handlePress(e) {
    this.convertAndApply(e, note => this.controller.play(note));
  }

  handleRelease(e) {
    this.convertAndApply(e, note => this.controller.release(note));
  }

  componentDidMount() {
    document.addEventListener("keydown", e => this.handlePress(e));
    document.addEventListener("keyup", e => this.handleRelease(e));
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <Keyboard/>
        <div>
          {this.state.notes.toString()}
        </div>
        <ul>
          {this.createInstruments()}
        </ul>
      </div>
    );
  }
}

export default App;

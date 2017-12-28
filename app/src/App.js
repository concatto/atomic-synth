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
      notes: [],
      instruments: [],
      instrument: 0,
    };

    this.controller = new MediaController();
    this.controller.on("changed", notes => this.setState({notes}));
    this.controller.on("instrumentsloaded", instruments => this.setState({instruments}));
    this.controller.on("instrumentchanged", instrument => this.setState({instrument}));
    window.controller = this.controller;
  }

  createInstruments() {
    return this.state.instruments.map((instrument, i) => (
      <li onClick={() => this.controller.changeInstrument(instrument.program)} key={i}>
        {instrument.name}
      </li>
    ));
  }

  convertAndApply(event, func) {
    const index = indexOf(event.key);
    const note = toNote(index, event.shiftKey);

    if (note !== undefined) {
      func(note);
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
    const { instruments, instrument, notes } = this.state;
    const inst = instruments[instrument]

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Atomic Synth</h1>
        </header>
        <h3>{inst ? inst.name : "Loading"}</h3>
        <Keyboard active={notes}/>
        <div>
          {notes.toString()}
        </div>
        <ul>
          {this.createInstruments()}
        </ul>
      </div>
    );
  }
}

export default App;

import React from 'react';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import List, { ListItem, ListItemText } from 'material-ui/List';
import MediaController, { names } from './logic/media';
import { indexOf } from './logic/keymap';
import { toNote } from './logic/notes';
import Keyboard from './components/Keyboard';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      notes: [],
      availableInstruments: [],
      instruments: [],
    };

    this.controller = new MediaController();
    this.controller.on("changed", notes => this.setState({notes}));
    this.controller.on("instrumentsloaded", availableInstruments => this.setState({availableInstruments}));
    this.controller.on("instrumentschanged", instruments => this.setState({instruments}));
    window.controller = this.controller;
  }

  createInstruments() {
    const change = (program) => this.controller.changeInstrument(program);

    return this.state.availableInstruments.map((instrument, i) => (
      <Typography type="body1" onClick={() => change(instrument.program)} key={i}>
        {instrument.name}
      </Typography>
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
    const { availableInstruments, instruments, notes } = this.state;

    return (
      <div className="root">
        <AppBar position="static">
          <Toolbar>
            <Typography type="title" color="inherit" className="expand">
              Atomic Synth
            </Typography>
          </Toolbar>
        </AppBar>
        <Grid container justify="center">
          <Grid item xs={10}>
            <div className="vcenter">
              {instruments.map((val, i) => (
                <Typography type="headline" key={i}>
                  {availableInstruments[val].name}
                </Typography>
              ))}
              <Keyboard active={notes} width={600}/>
            </div>


            <Paper>
              {this.createInstruments()}
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default App;

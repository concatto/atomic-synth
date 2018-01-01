import React from 'react';
import NewIcon from 'material-ui-icons/Add';
import EditIcon from 'material-ui-icons/Edit';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import List, { ListItem, ListItemText } from 'material-ui/List';
import MediaController, { names } from './logic/media';
import { indexOf } from './logic/keymap';
import { toNote } from './logic/notes';
import Keyboard from './components/Keyboard';
import DialogRoot, { dialogStore } from './components/DialogRoot';
import InstrumentDialog from './components/InstrumentDialog';
import './App.css';

import { observer } from 'mobx-react';

@observer
class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      notes: [],
    };

    this.controller = new MediaController();
    this.controller.on("changed", notes => this.setState({notes}));
    window.controller = this.controller;
  }

  createInstruments() {
    const change = (program) => this.controller.changeInstrument(program);

    return this.controller.availableInstruments.map((instrument, i) => (
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

  openInstrument(callback) {
    dialogStore.open("INSTRUMENT", {
      onComplete: (result) => {
        dialogStore.close();
        callback(result);
      }
    });
  }

  openChangeInstrument(index) {
    this.openInstrument(inst => this.controller.changeInstrument(inst.program, index));
  }

  openNewInstrument() {
    this.openInstrument(inst => this.controller.addInstrument(inst.program));
  }

  render() {
    const { notes } = this.state;

    return (
      <div className="root">
        <AppBar position="static">
          <Toolbar>
            <Typography type="title" color="inherit" className="expand">
              Atomic Synth
            </Typography>
          </Toolbar>
        </AppBar>

        <DialogRoot>
          <InstrumentDialog name="INSTRUMENT"
            instruments={this.controller.availableInstruments}/>
        </DialogRoot>

        <Grid container justify="center">
          <Grid item xs={10}>
            <Keyboard active={notes} width={600}/>
            
            <div className="hcenter">
              <Typography type="title" className="expand">
                Instruments ({this.controller.instruments.length}/15)
              </Typography>
              <Button color="primary" onClick={() => this.openNewInstrument()}>
                Add new instrument
              </Button>
            </div>

            {this.controller.detailedInstruments.map((inst, i) => (
              <div className="hcenter" key={i}>
                <Typography type="subheading">
                  {inst.name}
                </Typography>
                <IconButton color="accent" onClick={() => this.openChangeInstrument(i)}>
                  <EditIcon/>
                </IconButton>
              </div>
            ))}
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default App;

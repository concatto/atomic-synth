import { asNatural, asSharp, toMidi } from './notes';
import { observable, computed } from 'mobx';
import last from 'lodash/last';
const sf = window.require('soundfont-player');
const { exec } = window.require('child_process');
const EventEmitter = window.require('events');

const SFPATH = "/home/concatto/genusrmusescore.sf2";

class MediaController extends EventEmitter {
  @observable availableInstruments = [];
  @observable instruments = [];

  constructor() {
    super();

    this.activeNotes = {};
    this.suppressed = false;
    this.ready = false;
    this.response = [];
    this.fsHandle = exec("fluidsynth -a alsa");
    this.fsHandle.stdout.on("data", data => {
      const parts = data.split("\n");

      for (const part of parts) {
        if (part.startsWith("> ")) {
          // A complete message just came through, emit it
          this.emit("output", this.processResponse(this.response));

          // And then clear it
          this.response = [];

          // Push back the remainder of the line
          if (part.length > 2) {
            this.response.push(part.substring(2));
          }

          // We're clear to send commands now
          if (this.ready === false) {
            this.emit("ready");
            this.ready = true;
          }
        } else {
          this.response.push(part);
        }
      }
    });

    this.on("ready", () => {
      this.send(`load ${SFPATH}`).then(res => {
        const id = res[0].match(/has ID (\d+)/)[1];

        return this.send(`inst ${id}`);
      }).then(res => {
        this.availableInstruments = this.processInstruments(res);
        this.addInstrument(0);
      });
    });
  }

  processInstruments(instruments) {
    return instruments.map(inst => {
      const matches = inst.match(/(\d+)-(\d+)\s(.*)/);
      if (matches && matches[3]) {
        return {
          bank: parseInt(matches[1], 10),
          program: parseInt(matches[2], 10),
          name: matches[3]
        };
      }

      return null;
    }).filter(el => el !== null && el.bank === 0);
  }

  processResponse(response) {
    return response.filter(el => el.length > 0).slice(1);
  }

  send(message) {
    const promise = new Promise((res, rej) => {
      this.once("output", res);
    });

    this.fsHandle.stdin.write(message + "\n");
    return promise;
  }

  doRelease(note) {
    //console.log("Trying to release", note);
    if (this.activeNotes[note] !== undefined) {
      for (let i = 0; i < this.instruments.length; i++) {
        this.send(`noteoff ${i} ${toMidi(note)}`);
      }

      delete this.activeNotes[note];
      this.emitChanged();
    }
  }

  canPlay(note) {
    if (this.activeNotes[asNatural(note)] === undefined) {
      return note[0] === "B" || note[0] === "E" || this.activeNotes[asSharp(note)] === undefined;
    }

    return false;
  }

  play(note) {
    if (this.canPlay(note)) {
      for (let i = 0; i < this.instruments.length; i++) {
        this.send(`noteon ${i} ${toMidi(note)} 127`);
      }

      this.activeNotes[note] = 127;
      this.emitChanged();
    }
  }

  release(note) {
    this.doRelease(asNatural(note));

    if (note[0] !== "B" && note[0] !== "E") {
      this.doRelease(asSharp(note));
    }
  }

  changeInstrument(id, channel = 0) {
    this.send(`prog ${channel} ${id}`).then(() => {
      this.instruments[channel] = id;
    });
  }

  addInstrument(id) {
    this.instruments.push(id);
    this.changeInstrument(id, this.instruments.length - 1);
  }

  removeInstrument(index) {
    this.instruments.splice(index, 1);

    for (let i = index; i < this.instruments.length; i++) {
      this.changeInstrument(this.instruments[i], i);
    }
  }

  emitChanged() {
    if (!this.suppressed) {
      this.emit("changed", Object.keys(this.activeNotes));
    }
  }

  @computed get detailedInstruments() {
    return this.instruments.map(inst => this.availableInstruments[inst]);
  }
}

export default MediaController;

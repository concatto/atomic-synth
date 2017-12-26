import { asNatural, asSharp, toMidi } from './notes';
const sf = window.require('soundfont-player');
const { exec } = window.require('child_process');
const EventEmitter = window.require('events');

class MediaController extends EventEmitter {
  constructor() {
    super();

    this.activeNotes = {};
    this.fsHandle = exec("fluidsynth -a alsa");
    this.fsHandle.stdout.on("data", console.log);
    this.fsHandle.stderr.on("data", console.log);

    this.send("load /home/concatto/gu_gs.sf2");
  }

  send(message) {
    this.fsHandle.stdin.write(message + "\n");
  }

  doRelease(note) {
    //console.log("Trying to release", note);
    if (this.activeNotes[note] !== undefined) {
      this.send(`noteoff 0 ${toMidi(note)}`);

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
      this.send(`noteon 0 ${toMidi(note)} 127`);
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

  changeInstrument(id) {
    this.send(`prog 0 ${id}`);
  }

  load(name) {
    // const options = {
    //   soundfont: "MusingKyte",
    //   format: "ogg",
    //   gain: 10,
    // };
    //
    // return sf.instrument(this.ac, name, options).then(value => {
    //   this.instrument = value;
    //   return value;
    // });
  }

  emitChanged() {
    this.emit("changed", Object.keys(this.activeNotes));
  }
}

export default MediaController;
export const names = window.require('soundfont-player/names/musyngkite.json');

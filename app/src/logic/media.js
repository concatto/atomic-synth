import { asNatural, asSharp } from './notes';

const sf = window.require('soundfont-player');
const ac = new AudioContext();

let instrument;
const activeNotes = {};

function doRelease(note) {
  console.log("Trying to release", note);
  if (activeNotes[note] !== undefined) {
    activeNotes[note].stop();
    delete activeNotes[note];
  }
}

export function play(note) {
  console.log(activeNotes);
  console.log(asNatural(note));
  console.log(asSharp(note));
  if (activeNotes[asNatural(note)] === undefined &&
      activeNotes[asSharp(note)] === undefined) {
    const handle = instrument.play(note);
    activeNotes[note] = handle;
  }
}

export function release(note) {
  doRelease(asNatural(note));
  doRelease(asSharp(note));
}

export function load(name) {
  return sf.instrument(ac, name, {soundfont: "MusingKyte"}).then(value => {
    instrument = value;
    return value;
  });
}

export const names = window.require('soundfont-player/names/musyngkite.json');

const sf = window.require('soundfont-player');
const ac = new AudioContext();

let instrument;

export function play(note) {
  instrument.play(note).stop(ac.currentTime + 2);
}

export function load(name) {
  return sf.instrument(ac, name, {soundfont: "MusingKyte"}).then(value => {
    instrument = value;
    return value;
  });
}

export const names = window.require('soundfont-player/names/musyngkite.json');

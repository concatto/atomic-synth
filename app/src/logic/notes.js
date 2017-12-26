const names = "CDEFGAB".split("");
const allNotes = [
  "C", "C#",
  "D", "D#",
  "E",
  "F", "F#",
  "G", "G#",
  "A", "A#",
  "B"
];

export function toNote(index, sharp = false, baseName = "C", baseOctave = 2) {
  const adjusted = index + names.indexOf(baseName);
  const name = names[adjusted % 7];
  const octave = Math.floor(adjusted / 7) + baseOctave;

  return name + (sharp ? "#" : "") + String(octave);
}

export function toMidi(note) {
  const index = allNotes.indexOf(note.replace(/[0-9]/, ""));
  const octave = parseInt(note[note.length - 1], 10);

  return index + (allNotes.length * octave);
}

export function asSharp(note) {
  if (note.indexOf("#") < 0) {
    if (note[0] === "B") {
      // B sharp is C natural
      note[0] = "C";
      note[note.length - 1] = parseInt(note[note.length - 1], 10) + 1;

      return note;
    } else if (note[0] === "E") {
      // E sharp is F natural
      note[0] = "F";

      return note;
    }

    const arr = note.split("");
    arr.splice(1, 0, "#");

    return arr.join("");
  }

  return note;
}

export function asNatural(note) {
  return note.replace(/#/, "");
}

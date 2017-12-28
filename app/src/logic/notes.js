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
  if (index === undefined) return undefined;

  const adjusted = index + names.indexOf(baseName);
  const name = names[adjusted % 7];
  const octave = Math.floor(adjusted / 7) + baseOctave;

  const note = name + String(octave);
  if (sharp && hasSharp(note)) {
    return asSharp(note);
  }

  return note;
}

export function toMidi(note) {
  const index = allNotes.indexOf(note.replace(/[0-9]/, ""));
  const octave = parseInt(note[note.length - 1], 10);

  return index + (allNotes.length * octave);
}

export function asSharp(note) {
  if (note.indexOf("#") < 0) {
    const octave = parseInt(note[note.length - 1], 10);

    if (note[0] === "B") {
      // B sharp is C natural
      return "C" + (octave + 1);
    } else if (note[0] === "E") {
      // E sharp is F natural
      return "F" + octave;
    }

    const arr = note.split("");
    arr.splice(1, 0, "#");

    return arr.join("");
  }

  return note;
}

export function hasSharp(note) {
  return note[0] !== "B" && note[0] !== "E";
}

export function asNatural(note) {
  return note.replace(/#/, "");
}

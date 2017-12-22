const names = "CDEFGAB".split("");

export function toNote(index, sharp = false, baseName = "C", baseOctave = 2) {
  const adjusted = index + names.indexOf(baseName);
  const name = names[adjusted % 7];
  const octave = Math.floor(adjusted / 7) + baseOctave;

  return name + (sharp ? "#" : "") + String(octave);
}

export function asSharp(note) {
  if (note.indexOf("#") < 0) {
    const arr = note.split("");
    arr.splice(1, 0, "#");
    return arr.join("");
  }

  return note;
}

export function asNatural(note) {
  return note.replace(/#/, "");
}

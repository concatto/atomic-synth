const keyboard = (
  "1234567890" +
  "qwertyuiop" +
  "asdfghjkl" +
  "zxcvbnm"
);

const map = {};
keyboard.split("").forEach((key, index) => map[key] = index);

export function indexOf(key) {
  return map[key.toLowerCase()];
}

const { exec } = require("child_process");

const handle = exec("fluidsynth -a alsa");
handle.stdout.on("data", console.log);
handle.stderr.on("data", console.log);


setTimeout(() => {
  handle.stdin.write("load /home/concatto/gu_gs.sf2\n");
  handle.stdin.write("noteon 0 40 127\n");
}, 3000);

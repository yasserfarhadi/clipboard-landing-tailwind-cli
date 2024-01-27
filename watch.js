const { watch } = require('node:fs/promises');
const path = require('node:path');
const shell = require('shelljs');

let lastEvent = 0;

(async () => {
  try {
    const watcher = watch(path.join(process.cwd(), 'src', 'index.html'));
    shell.exec('tailwindcss -i ./src/input.css -o ./src/styles.css');
    for await (const event of watcher) {
      if (event.eventType === 'change') {
        if (Date.now() - lastEvent > 2000 || lastEvent === 0) {
          lastEvent = Date.now();
          shell.exec('tailwindcss -i ./src/input.css -o ./src/styles.css');
        }
      }
    }
  } catch (err) {
    if (err.name === 'AbortError') return;
    throw err;
  }
})();

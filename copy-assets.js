const fs = require('fs-extra');
const path = require('path');

const source = path.resolve(__dirname, 'src/assets');
const destination = path.resolve(__dirname, 'dist/assets');

fs.copy(source, destination, (err) => {
    if (err) {
        console.error('Error copying assets', err);
        process.exit(1);
    }
    console.log('index.d.ts copied to dist/');
});

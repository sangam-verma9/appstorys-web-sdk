const fs = require('fs');
const path = require('path');

const source = path.resolve(__dirname, 'src/index.d.ts');
const destination = path.resolve(__dirname, 'dist/index.d.ts');

fs.copyFile(source, destination, (err) => {
    if (err) {
        console.error('Error copying index.d.ts:', err);
        process.exit(1);
    }
    console.log('index.d.ts copied to dist/');
});

const fs = require('fs');
const esbuild = require('esbuild');
const path = require('path');

function copyDir(src, dest) {
    fs.mkdirSync(dest, { recursive: true });
    let entries = fs.readdirSync(src, { withFileTypes: true });

    for (let entry of entries) {
        let srcPath = path.join(src, entry.name);
        let destPath = path.join(dest, entry.name);

        entry.isDirectory() ? copyDir(srcPath, destPath) : fs.copyFileSync(srcPath, destPath);
    }
}

// Main build function
function buildGame() {
    const template = fs.readFileSync('template.html', 'utf-8');
    let code = `<script src="/helper.js"></script>\n<script src="/config.js"></script>\n<script src="/assets.js"></script>\n<script src="/big.js"></script>\n<script src="/levels.js"></script>\n<script src="/patrol.js"></script>\n<script src="/utils.js"></script>\n<script src="/game.js"></script>\n`;

    const buildConfig = [
        {
            entryPoints: ['code/main.js'],
            outfile: 'dist/game.js'
        },
        {
            entryPoints: ['code/config.js'],
            outfile: 'dist/config.js'
        },
        {
            entryPoints: ['code/assets.js'],
            outfile: 'dist/assets.js'
        },
        {
            entryPoints: ['code/big.js'],
            outfile: 'dist/big.js'
        },
        {
            entryPoints: ['code/levels.js'],
            outfile: 'dist/levels.js'
        },
        {
            entryPoints: ['code/patrol.js'],
            outfile: 'dist/patrol.js'
        },
        {
            entryPoints: ['code/utils.js'],
            outfile: 'dist/utils.js'
        },
        {
            entryPoints: ['helper.ts'],
            outfile: 'dist/helper.js'
        }
    ];

    try {
        buildConfig.forEach(config => {
            esbuild.buildSync({
                ...config,
                bundle: true,
                sourcemap: true,
                target: 'es2017',
                keepNames: true,
                logLevel: 'silent'
            });
        });

        fs.writeFileSync('dist/index.html', template.replace('{{kaboom}}', code));

        copyDir('sprites', 'dist/sprites');
        copyDir('sounds', 'dist/sounds');

        console.log('The build is successful!');
        console.log('Build completed successfully.');
    } catch (error) {
        console.error('Build failed:', error);
        process.exit(1);
    }
}

// Run build
buildGame();

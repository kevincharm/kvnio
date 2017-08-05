const fs = require('fs')
const path = require('path')
const { exec } = require('child_process')

const WATCH_DIR = path.join(__dirname, 'src/')
const BUILD_SCRIPT = path.join(__dirname, 'build.sh')

const build = () => exec(BUILD_SCRIPT)

fs.watch(WATCH_DIR, {
    persistent: true,
    recursive: true
}, (eventType, filename) => {
    console.log(`\x1B[33;1mChanged: ${filename}, rebuilding...\x1B[0m`)
    build()
})

console.log(`\x1B[33;1mBuilding...\x1B[0m`)
build()
console.log(`\x1B[32;1mWatching ${WATCH_DIR}\x1B[0m`)

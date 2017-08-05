#!/bin/bash
HTML_OUT=./build/kvnio.html
mkdir -p build
rm -f $HTML_OUT
mandoc -T html ./src/kvnio.1 > $HTML_OUT
node ./build.js

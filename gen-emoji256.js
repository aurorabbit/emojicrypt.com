#!/usr/bin/env node

var input = require('./base-emoji/emojis.json');

var output = { chars: [], names: [] }

input.forEach(function(emoji, index) {
    output.chars[index] = emoji.char;
    output.names[index] = emoji.name;
});

var fs = require('fs')
fs.writeFileSync('emoji256.json', JSON.stringify(output));
fs.writeFileSync('emoji256.js', "var emoji256 = " + JSON.stringify(output) + ";");


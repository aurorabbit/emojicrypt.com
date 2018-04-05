
function toBuffer(v) {
  if (!ArrayBuffer.isView(v))
    throw new Error('Invalid ArrayBuffer');
  if (!v instanceof Uint8Array)
    throw new Error('ArrayBuffer must be a Uint8Array');
  return v
}

function convert(buf, fn) {
  buf = toBuffer(buf)
  var out = ''
  for (var i = 0; i < buf.length; i++) {
    out += fn(buf[i])
  }
  return out
}

exports.toUnicode =
exports.toUtf8 = function(buf) { // toUtf8 is legacy, it's inaccurate - JS is utf16
  return convert(buf, function(c) {
    return emojis.chars[c]
  })
}

exports.toNames = function(buf) {
  return convert(buf, function(c) {
    return ':'+emojis.names[c]+':'
  })
}

exports.toCustom = function(buf, fn) {
  return convert(buf, function(c) {
    return fn(c)
  })
}

exports.fromUnicode = function (s) {
  s = getSymbols(s)
  var buf = new Uint8Array(s.length)
  s.forEach(function (symbol, index) {
    for (var i=0; i < emojis.length; i++) {
      if (emojis.chars[i] == symbol) {
        buf.writeUIntBE(i, index, 1)
        break
      }
    }
    if (i == emojis.length)
      throw new Error('Failed to match symbol: ' + symbol + ' (' + symbol.charCodeAt(0) + ' ' + symbol.charCodeAt(1) + ')')
  })
  return buf
}

// https://mathiasbynens.be/notes/javascript-unicode
// ^ doing the lord's work
function getSymbols(string) {
  var length = string.length;
  var index = -1;
  var output = [];
  var character;
  var charCode;
  while (++index < length) {
    character = string.charAt(index);
    charCode = character.charCodeAt(0);
    if (charCode >= 0xaa && charCode <= 0xDBFF) {
      // Note: this doesn’t account for lone high surrogates;
      // you’d need even more code for that!
      output.push(character + string.charAt(++index));
    } else { 
      output.push(character);
    }
  }
  return output;
}

var baseEmoji = {};

function toBuffer(v) {
  if (v instanceof ArrayBuffer)
    return new Uint8Array(v)
  if (!ArrayBuffer.isView(v))
    throw new Error('Invalid ArrayBuffer');
  if (!v instanceof Uint8Array)
    throw new Error('Buffer must be Uint8Array'); //?
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

baseEmoji.toUnicode =
baseEmoji.toUtf8 = function(buf) { // toUtf8 is legacy, it's inaccurate - JS is utf16
  return convert(buf, function(c) {
    return emoji256.chars[c]
  })
}

baseEmoji.toNames = function(buf) {
  return convert(buf, function(c) {
    return ':'+emoji256.names[c]+':'
  })
}

baseEmoji.toCustom = function(buf, fn) {
  return convert(buf, function(c) {
    return fn(c)
  })
}

baseEmoji.fromUnicode = function (s) {
  s = getSymbols(s)
  var buf = new Uint8Array(s.length)
  s.forEach(function (symbol, index) {
    var byte = emoji256.chars.indexOf(symbol);
    if (byte == -1)
      throw new Error('Failed to match symbol: ' + symbol + ' (' + symbol.charCodeAt(0) + ' ' + symbol.charCodeAt(1) + ')')
    buf[index] = byte;
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

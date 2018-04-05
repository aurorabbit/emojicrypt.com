
function toBuffer(v) {
  if (!ArrayBuffer.isView(v))
    throw new Error('Invalid ArrayBuffer');
  if (!v instanceof Uint8Array)
    return Uint8Array(v);
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
    var byte = emojis.chars.indexOf(symbol);
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

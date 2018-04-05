# Function documentation


### emojicrypt functions


##### ``protocol[1].decodeParamsHeader(header)``

Takes a number between 0 and 63 (``0b00111111``).

Outputs SCrypt params (the only algo for ``v1``).

```js
header = emoji256.chars.indexOf(emojicrypt[0])

typeof(header) == 'number'
header >= 0  &&  header <= 0b0011111

params = protocol[1].decodeParamsHeader(header)

typeof(params.N) == 'number'
typeof(params.r) == 'number'
typeof(params.s) == 'number'

params.N >= 10  &&  params.N <= 17  // scrypt N
params.r == 12  ||  params.r == 8   // scrypt r
params.s ==  6  ||  params.s == 4   // emojis for salt
```

NOTE: this function will not change once ``v1`` is released.


##### ``protocol[1].encodeHeader(N, large_r, large_salt)``

Takes a limited configuration of SCrypt options, and outputs them into an 8 bit number.

First 3 bits are version number ``0b001``.

```js
typeof(N) == 'number'
N >= 10  &&  N <= 17

if (!!large_r) r will be 12, otherwise 8
if (!!large_salt) salt will be 6 emojis, otherwise 4

header = protocol[1].encodeHeader(N, large_r, large_salt)
typeof(header) == 'number'
header >= 0  && header <= 0b00111111

output = emoji256.chars[header]
output += salt
output += ciphertext
```

NOTE: this function will not change once ``v1`` is released.


##### ``decodeParams(emojicrypt)``

Outputs ``{ version, N, r, p }`` from an ``emojicrypt``.

```js
typeof(emojicrypt) == 'string'
emoji256.chars.indexOf(emojicrypt[0]) !== -1

params = decodeParams(emojicrypt)

typeof(params.version) == 'number'
typeof(params.N) == 'number'
typeof(params.r) == 'number'
typeof(params.s) == 'number'

params.version == 1
params.N >= 10  &&  params.N <= 17  // scrypt N
params.r == 12  ||  params.r == 8   // scrypt r
params.s ==  6  ||  params.s == 4   // emojis for salt
```

NOTE: this function's return values will likely be changing with new protocol versions.



##### ``generateEmojiSalt(length)``

Outputs a string of emojis as a salt

```js
typeof(length) == 'number'
length > 0

salt = generateEmojiSalt(length)

typeof(salt) == 'string'
salt.length == length*2 // emoji are 2-wide in js
```

# Function documentation


### emojicrypt functions


##### ``protocol[1].decodeHeader(header)``

Takes a byte

Returns SCrypt params (the only algo for ``v1``).

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
output += hmac
output += salt
output += ciphertext
```

NOTE: this function will not change once ``v1`` is released.


##### ``protocol[1].scrypt(passphrase, salt, N, r, progress)``

Runs the scrypt-js library using the given parameters.

The only sanity check is for the ``progress`` callback.

Returns a Promise for a ``Uint8Array`` encoded ``scryptHash``.

```js
passphrase = buffer.Buffer("passphrase".normalize("NFKC"))
salt = generateSalt(s)
N >= 10  &&  N <= 17
r ==  8  ||  r == 12

prototype[1].scrypt(passphrase, salt, N, r).then(function(hash) {
    hash instanceof Uint8Array
    hash.length = prototype[1].dkLen
})
```


##### ``decodeHeader(emojicrypt)``

Outputs ``{ version, N, r, p }`` from an ``emojicrypt``.

```js
typeof(emojicrypt) == 'string'
emoji256.chars.indexOf(emojicrypt[0]) !== -1

header = decodeHeader(emojicrypt)

typeof(header.version) == 'number'
typeof(header.N) == 'number'
typeof(header.r) == 'number'
typeof(header.s) == 'number'

header.version == 1
header.N >= 10  &&  header.N <= 17  // scrypt N
header.r == 12  ||  header.r == 8   // scrypt r
header.s ==  6  ||  header.s == 4   // emojis for salt
```

NOTE: this function's return values will likely be changing with new protocol versions.



##### ``generateSalt(length)``

Returns a buffer with ``length`` random bytes

```js
typeof(length) == 'number'
length > 0

salt = generateSalt(length)

salt instanceof Uint8Array()
ArrayBuffer.isView(salt)
salt.length == length
```


##### ``importKey(algo, key, uses, exportable)``

Imports a raw key from an ArrayBuffer.

Returns a ``Promise`` for ``key`` as ``CryptoKey``.

```js
algo = "AES-GCM"
key = new Uint8Array([1,3,3,7])

importKey(algo, key, ["encrypt"]).then(function(key) {
    encryptGCM(generateSalt(6), key, buffer.Buffer("Hello, world"))
})
```


##### ``decryptGCM(salt, key, ciphertext)``

Decrypts ``ciphertext`` using ``key``, and ``salt`` as the ``iv``.

Returns a ``Promise`` for ``plaintext`` as ``ArrayBuffer``.

```js
salt = generateSalt(6)
key instanceof CryptoKey
key.usages.indexOf("decrypt") != -1
ciphertext instanceof Uint8Array

decryptGCM(salt, key, ciphertext).then(function(plaintext) {
    plaintext instanceof ArrayBuffer
})
```


##### ``encryptGCM(salt, key, data)

Encrypts ``data`` using ``key``, and ``salt`` as the ``iv``.

Returns a ``Promise`` for ``ciphertext`` as ``ArrayBuffer``.

```js
salt = generateSalt(6)
key instanceof CryptoKey
key.usages.indexOf("decrypt") != -1
data = buffer.Buffer("Hello, world".normalize("NFKC"))

encryptGCM(salt, key, data).then(function(ciphertext) {
    ciphertext instanceof ArrayBuffer
})
```


##### ``sha256(data)```

Calculates the sha256sum of ``data``.

Returns a ``Promise`` for ``digest`` as ``ArrayBuffer``.

```js
sha256(new Uint8Array([1, 3, 3, 7])).then(function(digest) {
    digest instanceof ArrayBuffer
})
```

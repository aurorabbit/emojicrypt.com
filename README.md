# emojicrypt

Encrypt messages using SCrypt and AES-GCM, output in emoji!

Made for twitter and the fediverse.



## Thanks to

[``ricmoo/scrypt.js``](https://github.com/ricmoo/scrypt-js) [demo](http://ricmoo.github.io/scrypt-js/)

[``pfrazee/base-emoji``](https://github.com/pfrazee/base-emoji) base256 with Emoji

[WebCrypto](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)


## Project state

So far only the v1 protocol header encoding and decoding is done.

Expect updates in the next 24 hours~


## Compiling yourself

This repository tries to modify third party code as little as possible, and will provide ways for you to generate it yourself.

```sh
# NOTE: the --recursive is important
git clone --recursive https://github.com/aurorabbit/emojicrypt.com.git
cd emojicrypt

# checkout specific git commits
git --git-dir .git/modules/scrypt-js checkout 6254d45eb7edd38413c2672e14b42a1a1ad22781 # v2.0.3
git --git-dir .git/modules/base-emoji checkout 76ed24270be28a1ab9473a22cd43d2253cd4a06e # lastest

# generate js/emoji256.{js,json}
node gen-emoji256.js

# patch base-emoji to use the different emoji format
patch -o js/pfrazee-base-emoji.js base-emoji/index.js base-emoji.patch
```


## Planned

- Standalone "fat" HTML file
- emojicrypt.com
- emoji512 format
- Low, Medium, High, and Ultra security settings (SCrypt N param)
    - Low takes ~0.05s–0.2s in many browsers, Ultra takes ~2-6s.
    - Outside of the browser SCrypt runs much faster, so choose strong passphrases!
    - It may make sense to use PBKDF2 with WebCrypt in the next protocol.

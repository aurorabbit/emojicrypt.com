# emojicrypt

Encrypt messages using scrypt and AES-GCM, output in emoji!

Made for twitter and the fediverse.



## Thanks to

[``ricmoo/scrypt.js``](https://github.com/ricmoo/scrypt-js) [demo](http://ricmoo.github.io/scrypt-js/)

[``pfrazee/base-emoji``](https://github.com/pfrazee/base-emoji) base256 with Emoji

[WebCrypto](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)


## Project state

Project is in working condition.

There are still a few things to add, and docs need updating.

The v1 protocol is likely finalized: the 2 byte header defines scrypt N and r parameters, salt and HMAC lengths, ascii-only encoding, and lower-case-only passwords.

Documentation is needed for that.


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

This is written on a piece of paper, I may port it soon or just complete it.


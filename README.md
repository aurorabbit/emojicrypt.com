EmojiCrypt


Encrypt messages using SCrypt, AES, and Emoji!

https://github.com/ricmoo/scrypt-js
https://github.com/pfrazee/base-emoji


## Compiling yourself

```sh
# NOTE: the --recursive is important
git clone --recursive https://github.com/aurorabbit/emojicrypt.git
cd emojicrypt

# checkout specific git commits
git --git-dir .git/modules/scrypt-js checkout 6254d45eb7edd38413c2672e14b42a1a1ad22781 # v2.0.3
git --git-dir .git/modules/base-emoji checkout 76ed24270be28a1ab9473a22cd43d2253cd4a06e # lastest

# generate js/emoji256.{js,json}
node gen-emoji256.js

# patch base-emoji to use the different emoji format
patch -o js/pfrazee-base-emoji.js base-emoji/index.js base-emoji.patch
```


var protocol = {
    1: {
        // v1 protocol
        
        // 1 byte       header & scrypt params (encodeHeader, decodeHeader)
        // 4 bytes      MAC
        // 4 or 6 bytes salt
        // remaining    ciphertext
        
        // constants
        p: 1,
        dkLen: 32, // 256 div 8 = 32
        macLen: 4, // 4 emoji, 32 bits
        
        // 1 header emoji
        // 4 or 6 salt emojis
        // uses emoji256 set, from github.com/pfrazee/base-emoji
        // uses scrypt
        // N = 10 to 17, r = 8 or 12, salt length = 4 (32b) or 6 (48b) emojis
        //// header bit arrangement:
        ////  version      3 bits  always 0b001
        ////  scrypt N     3 bits  N = bits+10, i.e. 10 to 17
        ////  scrypt r     1 bit   r = 4*(bit+2), i.e. 8 or 12
        ////  salt length  1 bit   s = 2*(bit+2), i.e. 4 or 6 emojis
        decodeHeader: function(header) {
            if (typeof(header) != "number")
                throw new Error("Protocol header must be a number.");
            
            // unpack bits
            var v = header >> 5 & 0b111;  // version
            var N = header >> 2 & 0b111;  // scrypt N
            var r = header >> 1 & 0b1;    // scrypt r
            var s = header >> 0 & 0b1;    // salt size
            
            // verify the version
            if (v != 1) throw new Error("Not v1 protocol data.");
            
            // normalise the values
            N = N + 10;
            r = 4*(r + 2);
            s = 2*(s + 2);
            
            return { N: N, r: r, s: s };
        },
        // v1 encoding arguments
        //// N          scrypt N factor, between 10 and 17
        //// large_r    if truthy, scrypt r = 12, else r = 8
        //// large_salt if truthy, salt len = 6 emojis, else salt len = 4 emojis
        encodeHeader: function(N, large_r, large_salt) {
            var version, r, s;
            
            version = 1;
            
            // duck type for r and s
            r = !!large_r;
            s = !!large_salt;
            
            // sanity check for N, we"ll play fast and loose with r and s
            if (typeof(N) != "number") throw new Error("N must be a number.");
            if (N < 10) throw new Error("N too small.");
            if (N > 17) throw new Error("N too large.");
            // shrink N
            N = N - 10;
            
            // pack the values into a number
            return version << 5 | N << 2 | r << 1 | s;
        },
    },
};



function error(e) { return e; }



function decodeParams(emojicrypt) {
    var params, version, header;
    
    if (typeof(emojicrypt) !== "string")
        throw new Error("Invalid emojicrypt.");
    // https://github.com/pfrazee/base-emoji/blob/76ed2427/index.js#L55-L75
    emojicrypt = getSymbols(emojicrypt);
    
    header = emoji256.chars.indexOf(emojicrypt[0]);
    if (header == -1) throw new Error("Emoji not found.");
    
    version = header >> 5;
    
    if (!protocol[version]) throw new Error("Cannot parse this data");
    
    // may throw an error
    params = protocol[version].decodeHeader(header);
    
    return params;
}



function encrypt(N, r, s, data, passphrase, cb, pcb) {
    var header, salt, p, dkLen;
    
    if (data.length < 0) throw new Error("Invalid data.");
    if (passphrase.length < 0) throw new Error("Invalid password.");
    
    if (typeof(N) != "number") throw new Error("N must be a number.");
    if (typeof(r) != "number") throw new Error("r must be a number.");
    if (typeof(s) != "number") throw new Error("s must be a number.");
    
    if (N < 10  ||  N > 17) throw new Error("Invalid v1 N parameter.");
    if (r != 8  &&  r != 12) throw new Error("Invalid v1 r parameter.");
    if (s != 4  &&  s != 6) throw new Error("Invalid v1 s parameter.");
    
    passphrase = new buffer.Buffer(passphrase.normalize("NFKC"));
    
    // may throw an error
    header = protocol[1].encodeHeader(N, r==12, s==6);
    
    salt = generateSalt(s);
    
    // expand N
    N = Math.pow(2, N);
    // get constants
    p = protocol[1].p;
    dkLen = protocol[1].dkLen;
    
    scrypt(passphrase, salt, N, r, p, dkLen, function(err, progress, hash) {
        if (err) throw new Error(err);
        if (!hash) return (typeof(pcb) == "function" ? pcb(progress) : null);
        
        hash = new Uint8Array(hash);
        
        // hash is finished, import it as a key
        window.crypto.subtle.importKey(
            "raw", hash, { name: "AES-GCM" }, false, ["encrypt"]
        ).then(function(key) {
            
            return window.crypto.subtle.encrypt(
                
                { name: "AES-GCM", iv: salt },
                key, new buffer.Buffer(data.normalize('NFKC'))
                
            ).then(function(ciphertext) {
                
                header = emoji256.chars[header];
                ciphertext = exports.toUnicode(ciphertext);
                salt = exports.toUnicode(salt);
                
                cb(header + salt + ciphertext);
                
            });
            
        });
        
    });
    
}



function generateSalt(length) {
    if (length < 0) throw new Error("Invalid salt length");
    
    return window.crypto.getRandomValues(new Uint8Array(length));
}

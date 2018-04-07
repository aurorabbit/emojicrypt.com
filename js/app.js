
var decDom = {
    in: document.getElementById('decrypt-in'),
    out: document.getElementById('decrypt-out'),
    outSpan: document.querySelector('#decrypt-out span'),
    pw: document.getElementById('decrypt-pw'),
    button: document.getElementById('decrypt'),
    closeButton: document.getElementById('decrypt-close'),
    progress: {
        el: document.getElementById('decrypt-progress'),
        start: progressStart,
        fail: progressFail,
        success: progressSuccess,
        cb: progressScryptCallback,
    },
};

var encDom = {
    in: document.getElementById('encrypt-in'),
    out: document.getElementById('encrypt-out'),
    pw: document.getElementById('encrypt-pw'),
    button: document.getElementById('encrypt'),
    costRadio: document.getElementsByName('cost'), // plural
    copy: document.getElementById('copy'),
    progress: {
        el: document.getElementById('encrypt-progress'),
        start: progressStart,
        fail: progressFail,
        success: progressSuccess,
        cb: progressScryptCallback,
    },
};


decDom.closeButton.addEventListener('click', function() {
    decDom.out.style.display = 'none';
    decDom.outSpan.innerHTML = '';
});


var state = {
    isEncrypting: false,
    isDecrypting: false,
};


var scryptCostTable = {
    L: { N: 11, r: 8 },
    M: { N: 12, r: 8 },
    H: { N: 14, r: 8 },
    U: { N: 16, r: 12 },
};


function getScryptCostParams() {
    return scryptCostTable[
        [].filter.call(encDom.costRadio, function(e) {
            return e.checked;
        })[0].id
    ];
}


// Encryption functions
function doDecrypt() {
    var emojicrypt, pw;
    
    if (state.isDecrypting) {
        // TODO: cancel scrypt
        return;
    }
    
    emojicrypt = decDom.in.value;
    pw = decDom.pw.value.toLowerCase();
    
    if (emojicrypt.length < 2) return;
    
    state.isDecrypting = true;
    decDom.button.disabled = true;
    decDom.progress.start();
    decDom.out.style.display = 'none';
    decDom.outSpan.innerHTML = '';
    
   
    libemojicrypt.decrypt(
        emojicrypt, pw, decDom.progress.cb()
    ).then(function(message) {
        state.isDecrypting = false;
        decDom.button.disabled = false;
        decDom.progress.success();
        
        decDom.outSpan.innerHTML = message;
        decDom.out.style.display = 'block';
    }).catch(function(e) {
        console.error(e);
        state.isDecrypting = false;
        decDom.button.disabled = false;
        decDom.progress.fail();
    });
}

function doEncrypt() {
    var N, r, s, message, pw, params;
    
    if (state.isEncrypting) {
        // TODO: cancel scrypt
        return;
    }
    
    message = encDom.in.value;
    pw = encDom.pw.value.toLowerCase();
    
    if (message.length < 2) return;
    
    cost = getScryptCostParams();
    N = cost.N;
    r = cost.r;
    s = message.length > 490? 4 : 6;
    
    params = libemojicrypt.generateParams({
        N: N,
        r: r,
        s: s,
        ascii: /^[\x20-\xFF]*$/.test(message),
        lowerpw: true,
    });
    
    state.isEncrypting = true;
    encDom.button.disabled = true;
    encDom.progress.start();
    
    encDom.out.value = '';
    encDom.copy.disabled = true;
    
    try {
        
        libemojicrypt.encrypt(
            message, pw, params, encDom.progress.cb()
        ).then(function(message) {
            state.isEncrypting = false;
            encDom.button.disabled = false;
            encDom.progress.success();
            
            encDom.out.value = message;
            encDom.copy.disabled = false;
        });
        
    } catch(e) {
        console.error(e);
        state.isEncrypting = false;
        encDom.button.disabled = false;
        encDom.progress.fail();
    }
}


decDom.button.addEventListener('click', doDecrypt);
encDom.button.addEventListener('click', doEncrypt);
decDom.pw.addEventListener('keyup', function(evt) {
    if (evt.keyCode == 13) doDecrypt();
});
encDom.pw.addEventListener('keyup', function(evt) {
    if (evt.keyCode == 13) doEncrypt();
});

// progress bar functions
var progressStartingWidth = 2;
var progressScryptWidth = 94;
function progressStart() {
    this.el.style.width = progressStartingWidth + '%';
    this.el.className = [
        'progress-bar',
        'progress-bar-striped',
        'no-transition',
    ].join(' ');
}

function progressSuccess() {
    this.el.className = 'progress-bar bg-success';
    this.el.style.width = '100%';
}

function progressFail() {
    this.el.className = 'progress-bar bg-danger';
    this.el.style.width = '100%';
}

function progressScryptCallback() {
    return (function(progress) {
        this.el.style.width =
            progressScryptWidth * progress
            + progressStartingWidth + '%';
    }).bind(this);
}


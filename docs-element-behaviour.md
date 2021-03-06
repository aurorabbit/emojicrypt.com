# Page behaviours

Some documentation on the elements on the page and what they should do.



## Top links

 - Learn more - page on a github wiki?
 - [See the code](https://github.com/aurorabbit/emojicrypt)
 - Save offiline - page on a github wiki? or just a direct link to fat HTML file
 - Donate - to be determined



## Buttons

###### ``#decrypt``

The "Decrypt" button attached to ``#decrypt-pw``
- attempts to decrypt the emojicrypt in ``#decrypt-in`` using ``#decrypt-pw``
- progress is displayed with ``#decrypt-progress``
- the decrypt cancels if there is a change to ``#decrypt-in`` or ``#decrypt-pw``
- can be triggered using the enter key in ``#decrypt-in`` or ``#decrypt-pw``
- a successful decrypt:
    - outputs to ``#decrypt-output span``
    - unhides ``#decrypt-output``


##### ``#decrypt-close``

The "X" button in the top right corner of ``#decrypt-output``
- empties ``#decrypt-output``
- hides ``#decrypt-output``


##### ``#encrypt``

The "Encrypt" button attached to ``#encrypt-pw``
- will encrypt the message in ``#encrypt-in`` using ``#encrypt-pw`` and ``#cost``
- progress is displayed with ``#encrypt-progress``
- the encrypt cancels if there is a change to ``#encrypt-in`` or ``#encrypt-pw``
- can be triggered using the enter key in ``#encrypt-in`` or ``#encrypt-pw``
- a successful encrypt:
    - outputs to ``#encrypt-out``, which is always displayed
    - removes the ``disabled`` property from ``#copy``


##### ``#copy``

The "Copy" button attached to ``#encrypt-out``
- copies the value of ``#encrypt-out`` to the clipboard (when not disabled)


##### ``#cost``

The cost radio buttons located beneath ``#encrypt-pw``
- selecting a different one is the same as clicking ``#encrypt``


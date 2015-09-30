# Telefobia

A telephony assisted social-engineering and attack toolkit.

_Telefobia_ aids security awareness evaluation by providing an fast and easy interface to common phone systems vulnerabilities. 

## Features

- **Caller ID spoof:** Arbitrary caller ID call termination

- **Private caller unmask:** Reveals caller ID of private/anonymous caller

- **Conference in the middle attack:** A clever way of connecting two phone numbers into a spied-on conference call with each others' caller IDs.

- **DTMF redial attack:** A simple DTMF decoder to determine last dialed phones and tones played on analog phones.

- **Voice crack:** An automated PIN cracking and IVR fuzzing system

- **Pinocchio call:** A set of ambient noise conference for credible lies ( car-jam, crowd, rain, movies )

- **Call-swarm:** A clever way of making it into radio shows or inbound calls denial of service attack

- **Vader:** A voice cloaker for anonimity to darken voice 

- **Multiple interface:** Command line, phone and web interface alternatives.

## Install and configure

- You need an [Asterisk](http://www.asterisk.org/) box with [Node.js](http://www.nodejs.org/) installed in order to run Telefobia.

- Clone from git repo:

```bash
git clone https://github.com/xenomuta/telefobia.git
```

- Enter the folder where you cloned to and run:

```bash
npm install
```

- Create a `config.json` file in this same directory with the following values:

    - `outboundPeer`: The peer name to use for calls. ( Provider must accept arbitrary caller id setting for CallerID spoof and `P-Asserted-Identity` header to unmask private calls )  
    - `maxChannels`: Maximun number of concurrent calls this peer can handle ( default 24 )
    - `webPort`: Port number for web interface ( default 9000 )
    - `webPassword`: SHA password hash for web interface access
    - `phonePIN`: Digits for phone control interface
    - `phoneContext`: Extension context to dial into phone control interface
    - `phoneAccessNumber`: Extension number to dial into phone control interface
    - `recordingDirectory`: Where to store phone recordings at

    Example:

    ```json
    {
        "outChannel": "SIP/MyProvider",
        "maxChannels": 24,
        "webPort": 9090,
        "webPassword": "b2b835dc19950b5e3a8c3f1186d89236cd8ca388",
        "phonePIN": "9532",
        "phoneContext": "from-internal",
        "phoneNumber": "3137",
        "recordingDirectory": "/home/xenomuta/calls",
    }
    ```

- Configure asterisk:

    1) Enable the `execincludes = yes` setting in the `[options]` context in the `/etc/asterisk/asterisk.conf` file.

    2) Append this line to `/etc/asterisk/manager.conf`:

    ```asterisk
    #exec /path/to/telefobia/tf manager 
    ```

    3) Append this line to `/etc/asterisk/extensions.conf`:

    ```asterisk
    #exec /path/to/telefobia/tf extensions 
    ```

    4) Reload asterisk

- Enjoy telefobia:
    - Go to `http://ip:configured-port/` for web access.
    - Dial your number for phone interface
    - Run `tf help` for CLI commands

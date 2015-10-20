# Health
Simple Health System for linux servers, using NodeJs, ES2015, React, RethinkDB, and a lot of awesomeness

The monitor is made of sub-systems: a Station (aka client or node) in wich the data is read, and a Monitor (or server) to store the information, act as webserver

## Station (client)
The station, in a few words, is a express application, it have a RESP API that gives data with the state of the linux machine

## Installation

### DCMTK

[DCMTK - DICOM Toolkit](http://dicom.offis.de/dcmtk.php.en). This library implements the DICOM protocol, it has the `echoscu` command line tool, it's used in order to get a DICOM ECHO to a DICOM node.

In Debian/Ubuntu, can be installed as:
```
# apt-get install dcmtk
```

In OSX, DCMTK can be installed with Homebrew:  
```
# ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
# brew install dcmtk
```

### Node (with NVM)

In order to run the server node version 4.0+ is recommended, an east installation can be made with [NVM](`https://github.com/creationix/nvm`).

to install nvm, write in the console: 
```
# wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.28.0/install.sh --no-check-certificate | bash
$ nvm ls-remote
$ nvm install v4
$ nvm alias default stable
```

### Babel
The project has been developed in ES6, so, in order to make it work, we use [babel](http://babeljs.io/) as javascript compiler/transpiler, or a version of node who support ES6. (node v4.0+)
To run and keep working the app even on errors, is used [PM2](https://github.com/Unitech/pm2), it's a "production process manager for NodeJs. Perfectly fitted for microservices architecture", as ring to the finger.
I'ts higly recommender to install both as global:

```
# npm install -g babel pm2
```

### Clone the repo

To install, just clone the repo and install the dependencies with npm
```
# git clone https://github.com/DigitalDev-Toth/health-station.git
# cd health-station
# npm install
```

You also can configure some settings editing the file:
`/config/app.js`

## Test the API

To test if the APi get the data correctly, run the test::
```
$ npm run start-test
```

It must return something like this:
```
  7 passing (7s)
```

If a problem occurs, feel free to open a issue or make a pull request to improve the code 

## Run it baby!

In order to run te station:
```
$ npm run start-prod
```
the script runs the following command:

```
$ NODE_ENV=production pm2 start health-station.js -f --interpreter babel-node --name station && pm2 logs station",
```
`NODE_ENV=production` use the development configuration files, (see `/config/index.js` for more info)
`pm2 start health-station.js` call the entry point script,  `-f` is to force to restart the app if is already running, `--interpreter babel-node` use babel to run the code (for the ES6 compatibility), `--name station` is a name for the pm2 instance, finally `pm2 logs station` is to see the console output of the station. 

To stop the station:
```
$ npm run stop-prod
```
or more directly on the console:
```
$ pm2 stop station
```

# API Routes 

#### GET /v1/
Array with the information of every route lised bellow
```json
{
    "cpu": [
        {
            "CPU": "all",
            ...
        },
        {
            "CPU": "0",
            ...
        },
        {
            "CPU": "1",
            ...
        }
    ],
    "ram": {
        "kbfree": 3417117,
        ...
    },
    "discMounted": [
        {
            "MBfsfree": 456625,
            ...
        }
    ],
    "discIO": {
        "totalRequestPerSecond": 2.33,
        ...
    },
    "netIO": [
        {
            "interface": "eth2",
            ...
        }
    ],
    "pingNational": {
        "address": "www.emol.com",
        "port": 80,
        "attempts": 8,
        "avg": 112.21248600000001,
        ...
    },
    "pingInternational": {
        "address": "www.nytimes.com",
        "port": 80,
        "attempts": 8,
        "avg": 158.32892750000002,
        ...
    }
}
```

#### GET /v1/cpu
return an array, with the stats of every core of the last 3 seconds (configurable).
```json
[
    {
        "CPU": "all",
        "userPercent": 10.58,
        "nicePercent": 0,
        "systemPercent": 3.92,
        "iowaitPercent": 0.85,
        "stealPercent": 0,
        "idlePercent": 84.64
    },
    {
        "CPU": "0",
        "userPercent": 9.28,
        "nicePercent": 0,
        "systemPercent": 5.15,
        "iowaitPercent": 0.69,
        "stealPercent": 0,
        "idlePercent": 84.88
    },
    {
        "CPU": "1",
        ...
    }
]
```

#### GET /v1/ram
Memory utilization of the last 3 seconds (configurable).
```json
{
    "kbfree": 3451009,
    "kbused": 4722915,
    "kbbuffers": 111088,
    "kbcached": 1165388,
    "free": "3.45 GB",
    "used": "4.72 GB",
    "percentUsed": 57.78
}
```

#### GET /v1/disc
An array with the logic filesystems and his stats
```json
[
    {
        "MBfsfree": 456626,
        "MBfsused": 8686,
        "fsused": 1.87,
        "FILESYSTEM": "/dev/disk/by-uuid/e87ea436-9b9c-4a0c-bd0f-ab8a640137d0"
    }
]
```

#### GET /v1/discIO
Disc I/O operations stats of the last 3 seconds (configurable).
```json
{
    "totalRequestPerSecond": 12.33,
    "readRequestPerSecond": 1,
    "writeRequestPerSecond": 11.33,
    "blockReadsPerSecond": 8,
    "blockWritesPerSecond": 197.33
}
```


#### GET /v1/netIO
An array with the Network utilization of every interface in the last 3 seconds (configurable).
```json
[
    {
        "interface": "eth2",
        "rxkBps": 0.27,
        "txkBps": 0,
        "interfaceUtilization": 0
    }
]
```

#### GET /v1/ping
An array, the first element is a ping to a national server, and the second element is to an international server. Both address and number of attempts are configurable. 
```json
[
    {
        "address": "www.emol.com",
        "port": 80,
        "attempts": 8,
        "avg": 12.163561625,
        "max": 31.209731,
        "min": 8.883681,
        "results": [
            {
                "seq": 0,
                "time": 31.209731
            },
            {
                "seq": 1,
                "time": 9.262506
            },
            {
                "seq": 2,
                "time": 10.25427
            },
            {
                "seq": 3,
                "time": 9.833748
            },
            {
                "seq": 4,
                "time": 9.002274
            },
            {
                "seq": 5,
                "time": 8.883681
            },
            {
                "seq": 6,
                "time": 9.047601
            },
            {
                "seq": 7,
                "time": 9.814682
            }
        ]
    },
    {
        "address": "www.nytimes.com",
        "port": 80,
        "attempts": 8,
        "avg": 308.77631375,
        "max": 1179.338357,
        "min": 181.113504,
        "results": [
            {
                "seq": 0,
                "time": 199.566791
            },
            {
                "seq": 1,
                "time": 181.113504
            },
            {
                "seq": 2,
                "time": 183.304602
            },
            {
                "seq": 3,
                "time": 181.48339
            },
            {
                "seq": 4,
                "time": 181.398042
            },
            {
                "seq": 5,
                "time": 1179.338357
            },
            {
                "seq": 6,
                "time": 181.693964
            },
            {
                "seq": 7,
                "time": 182.31186
            }
        ]
```

#### GET /v1/ping/:pingHost
Make a ping to a custom host. Example `GET /v1/ping/9gag.com`

```json
{
    "address": "9gag.com",
    "port": 80,
    "attempts": 8,
    "avg": 266.933967875,
    "max": 274.60793,
    "min": 260.277802,
    "results": [
        {
            "seq": 0,
            "time": 274.60793
        },
        {
            "seq": 1,
            "time": 272.718204
        },
        {
            "seq": 2,
            "time": 264.213283
        },
        {
            "seq": 3,
            "time": 265.674945
        },
        {
            "seq": 4,
            "time": 265.151126
        },
        {
            "seq": 5,
            "time": 266.754569
        },
        {
            "seq": 6,
            "time": 260.277802
        },
        {
            "seq": 7,
            "time": 266.073884
        }
    ]
}
```

#### GET /v1/dicom
(... PENDING ...)
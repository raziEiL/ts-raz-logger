## Description
**ts-raz-util** is a personal configuration of winston logger.

## Installation
`npm i ts-raz-logger`

## Code Usages
```JS
import logger from "ts-raz-lib";
const log = logger();
log.info("[index.js]", "hi");
// Load custom config
const cLog = logger("./src/logger.json");
clog.info("[index.js]", "hi");
```
```JS
import logger from "ts-raz-lib";
import { f_moduleName } from "ts-raz-util";
const log = logger();
const TAG = f_moduleName(module);
log.info(TAG, "hi");
```
Output:  
`06/17/2020-17:37:54.511 pid: 3344 info: [index.js] hi`

## JSON Config
```JSON
{
    "production": {
        "silent": false,
        "level": "verbose",
        "toFile": false,
        "inspect": {
            "depth": 20,
            "showHidden": false
        },
        "format": {
            "timestamp": false,
            "pid": false,
            "level": true
        }
    },
    "dev": {
        "silent": false,
        "level": "debug",
        "toFile": true,
        "inspect": {
            "depth": 100,
            "showHidden": false
        },
        "format": {
            "timestamp": true,
            "pid": true,
            "level": true
        }
    }
}
```
## Environment variable
Add `DEV_MODE=TRUE` variable to load settings (logger.json) from `dev` object.

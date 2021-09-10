# API type formatter

This module can convert an API JSON description into TypeScript typings.

# Installation
```sh
npm i @islandpenguin/api-typewriter
```

# Configuration
Create file called convert-config.json in your porjects root directory.
The file should look like this.

```json
{
    "targetDir": "src/types",
    "src": [
        {
            "url": "http://localhost:3000/api",
            "name": "Api1"
        },
        {
            "url": "http://localhost:3000/api2",
            "name": "Api2"
        }
    ]
}
```

# Execute
Simply call:
```sh
node node_modules/@islandpenguin/api-typewriter/index.js
```

Or create a new script in your package.json file:
```json
"scripts": {
    "update-types": "node node_modules/@islandpenguin/api-typewriter/index.js"
 }
```
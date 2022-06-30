The JSON files under this directory will be automatically created while running Jest snapshot testing with `npm test`.

The JSON file can be used with `soracom soralets exec` command for testing uploaded WASM module on SORACOM platform e.g.

```console
$ soracom soralets exec \
   --soralet-id my-soralet \
   --version 1 \
   --direction uplink \
   --content-type application/json \
   --body @1.json // <- this
```

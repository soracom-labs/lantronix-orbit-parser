# AssemblyScript SDK for SORACOM Orbit

## Install

```console
npm i git+https://git@github.com/soracom/orbit-sdk-assemblyscript.git
```

## Usage

```ts
import {
  log,
  getInputBuffer,
  getInputBufferAsString,
  getTagValue,
  getSourceValue,
  getLocation,
  getTimestamp,
  setOutputJSON,
  log,
} from "orbit-sdk-assemblyscript";
```

- `getInputBuffer(): Uint8Array`: returns input body
- `getInputBufferAsString(): string`: returns input body as UTF-8 string
- `getTagValue(name: string): string`: returns tag value for tne name. Blank if no tag name found
- `getSourceValue(name: string): string`: returns source value for the name. Blank if no source name found
- `getLocation(): Location`: returns Location object (`{lat: f64, lon: f64}`). `NaN` will be returned if location is unavailable for some reason
- `getTimestamp(): i64`: returns timestamp
- `setOutputJSON(json: string): void`: set output JSON
- `log(message: string): void`: pass the string to Orbit runtime. Note: only string is supported.

Here you can see sample input for soralet, which has input body, tags, source, and location.

```json
{
  "codeSrn": "srn:soracom:<operator_id>:<coverage type>:Soralet:<soralet id>/<version>",
  "direction": "uplink",
  "contentType": "application/json",
  "body": "{\"value\":23.54,\"name\":\"sorao\"}",
  "source": {
    "resourceType": "Sigfox",
    "resourceId": "xxxxxx"
  },
  "tags": {
    "name": "test1",
    "org": "soracom"
  },
  "location": {
    "lat": 43.12345,
    "lon": 138.112233
  },
  "timestamp": 1587532201856
}
```

# Orbit AssemblyScript to parse Lantronix Telematic Gateways

## Prerequisite

- NPM: v14.17.3

## How to use

### Install dependencies

```
npm install
```

### Build

```
npm run build
```

### Test

You may need to update snapshot if you change files in `assemblyscript/tests/__snapshots__`.

```
npm run test:updateSnapshot
npm run test
```

## Deployment

### Build for production

```
npm run build:optimized
```

### Create Solalet

```
soracom soralets create --soralet-id taketo-soralet-fox3
```

### Get Solalet

```
soracom soralets get --soralet-id taketo-soralet-fox3

//output
{
"createdTime": 1642571306152,
"description": "",
"operatorId": "OP******",
"soraletId": "taketo-soralet-fox3",
"updatedTime": 1642571306152
}
```

### Upload Application

```
soracom soralets upload --soralet-id taketo-soralet-fox3 \
 --content-type application/octet-stream \
 --body @build/soralet-optimized.wasm

 //output
 {
	"createdTime": 1642571930980,
	"hash": "57dce4f57a17698fbf7fd0cc228ac18a9daf20a818774018fd6f69ab9e78e8c1edf289723ac5cf5119cf9c5ddc07b7727e578*****",
	"operatorId": "OP00*****",
	"size": 11896,
	"soraletId": "taketo-soralet-fox3",
	"srn": "srn:soracom:OP00*****:jp:Soralet:taketo-soralet-fox3/1",
	"version": 1
}
```

### Deploy Application

```
soracom groups put-config --group-id 8b4f2923-1441-4ec5-9abf-***** --namespace SoracomOrbit \
--body '[
  {
    "key": "enabled",
    "value": true
  },
  {
    "key": "codeSrn",
    "value": "srn:soracom:OP0033566196:jp:Soralet:taketo-soralet-fox3/$LATEST"
  },
  {
    "key": "useLocation",
    "value": false
  },
  {
    "key": "useMetadata",
    "value": false
  },
  {
    "key": "contentType",
    "value": "text/plain"
  },
  {
    "key": "enabled",
    "value": true
  },
  {
    "key": "direction",
    "value": [
      "uplink"
    ]
  }
]'
```

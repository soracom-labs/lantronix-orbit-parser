# Lantronix Orbit Parser

This is an AssemblyScript project for Lantronix telemetry devices such.
You can parse NMEA formatted data sent from devices to json.
However this module parses only the following data, Not all of them.

- GPRMC: includes gps coordinates

- Tested Devices: Fox3, Borelo

You can visualize the parsed data with Soracom lagoon.

## Data Format

If might send data as follows.

Original data from the device is as follows.

```
$<sfal.pos _speed='0.00'>*43 $GPRMC,073545.000,V,3542.3459,N,13946.6537,E,,,250122,,*17 $<end> $<sfal.event _batt='3.695' _temp='30' _power='12.070' Ignition='1'>*4D $GPRMC,073545.000,V,3542.3459,N,13946.6537,E,,,250122,,*17 $<end>
```

Parsed data format is as follows.

```
{
   "obdPos":{
      "speed":0.0
   },
   "gprmc":{
      "v0":"GPRMC",
      "v1":"082546.000",
      "v2":"V",
      "v3":"3542.3459",
      "v4":"N",
      "v5":"13946.6537",
      "v6":"E",
      "v7":"",
      "v8":"",
      "v9":"250122",
      "v10":"",
      "v11":"*1A",
      "latitude": 35.705765,
      "longitude": 139.777562,
   },
   "obdEvent":{
      "batt":3.976,
      "temp":32.0,
      "power":12.029,
      "ignition":1.0
   }
}
```

## Run the application

Please follow [this guide](assemblyscript/README.md) to run and deploy the application.

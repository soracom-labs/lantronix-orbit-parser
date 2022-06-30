import { SoraletPayload } from "./soralet_payload";

const operatorId = "OP1234567890";
const coverageType: "jp" | "g" = "jp";
const soraletId = "yourSoraletId";
const version = 1;
const codeSrn = `srn:soracom:${operatorId}:${coverageType}:Soralet:${soraletId}/${version}`;
const timestamp = 1587532201856;

// add your test cases here
export const inputs: SoraletPayload[] = [
  {
    codeSrn,
    direction: "uplink",
    contentType: "text/plain",
    body: "$<sfal.pos _speed='0.00'>*43 $GPRMC,071054.000,V,3542.3459,N,13946.6537,E,,,250122,,*10 $<end>",
    source: {
      resourceType: "Subscriber",
      resourceId: "440529999999950",
    },
    tags: {
      name: "test1",
      org: "soracom",
    },
    location: {
      lat: 43.12345,
      lon: 138.112233,
    },
    timestamp,
  },
  {
    codeSrn,
    direction: "uplink",
    contentType: "text/plain",
    body:
      "$<sfal.pos _speed='0.00'>*43 $GPRMC,073545.000,V,3542.3459,N,13946.6537,E,,,250122,,*17 $<end> $<sfal.event _batt='3.695' _temp='30' _power='12.070' Ignition='1'>*4D $GPRMC,073545.000,V,3542.3459,N,13946.6537,E,,,250122,,*17 $<end>",
    source: {
      resourceType: "Subscriber",
      resourceId: "440529999999950",
    },
    tags: {
      name: "test2",
      org: "soracom",
    },
    location: {
      lat: 43.12345,
      lon: 138.112233,
    },
    timestamp,
  },
];

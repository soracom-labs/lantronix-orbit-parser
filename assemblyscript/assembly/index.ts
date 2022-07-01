import { setOutputJSON, log, getInputBufferAsString } from "orbit-sdk-assemblyscript";

import { JSONEncoder } from "assemblyscript-json";
import * as Utils from "./utils";

// $<sfal.pos _speed='0.00'>*43 $GPRMC,025904.000,V,3542.3459,N,13946.6537,E,,,250122,,*1D $<end> $<sfal.event _batt='3.312' _temp='28' _power='12.070' Ignition='1'>*4E $GPRMC,025904.000,V,3542.3459,N,13946.6537,E,,,250122,,*1D $<end>

/**
 * process uplink (device -> SORACOM) message
 */
export function uplink(): i32 {
  const input = getInputBufferAsString();
  //$<sfal.pos _speed='0.00'>*43 $GPRMC,071054.000,V,3542.3459,N,13946.6537,E,,,250122,,*10 $<end>
  //$<sfal.event.warning text='Internal bettery is low' _batt='3.184'>*7D $GPRMC,070903.000,V,3542.3459,N,13946.6537,E,,,250122,,*1A $<end> $<sfal.event.warningtext='Internalbetteryislow'_batt='3.184'>*7D $GPRMC,070903.000,V,3542.3459,N,13946.6537,E,,,250122,,*1A $<end>
  log(input);
  const lines = input.replaceAll("\r\n", "").split("$");

  const encoder = new JSONEncoder();
  var isSfalPosFound = false;
  var isSfalEventFound = false;
  var isGPRMCFound = false;

  for (let i = 0; i < lines.length; ++i) {
    const data = lines[i].includes("sfal") ? lines[i].split(" ") : lines[i].split(",");
    if (data.length == 0) {
      continue;
    }

    const label = data[0];
    if (label == "GPRMC" && !isGPRMCFound) {
      //GPRMC,045752.000,V,3542.3459,N,13946.6537,E,,,250122,,*16
      isGPRMCFound = true;
      encoder.pushObject("gprmc");

      for (let j = 0; j < data.length; ++j) {
        encoder.setString("v" + j.toString(), data[j]);
      }

      const latitude: number = Utils.parseLatLon(data[3], data[4]);
      if (latitude !== 0) {
        encoder.setFloat("latitude", latitude);
      }

      const longitude: number = Utils.parseLatLon(data[5], data[6]);
      if (longitude !== 0) {
        encoder.setFloat("longitude", longitude);
      }

      encoder.popObject();
    } else if (label == "<sfal.pos" && !isSfalPosFound) {
      isSfalPosFound = true;

      encoder.pushObject("obdPos");

      for (let j = 0; j < data.length; ++j) {
        if (data[j].includes("_speed")) {
          //_speed='0.00'
          const speed: string = Utils.getValueFromKV(data[j]);
          if (speed != "") {
            encoder.setFloat("speed", parseFloat(speed));
          }
        }
      }

      encoder.popObject();

      //<sfal.event _batt='3.312' _temp='28' _power='12.070' Ignition='1'>*4E
    } else if (label == "<sfal.event" && !isSfalEventFound) {
      isSfalEventFound = true;

      encoder.pushObject("obdEvent");

      for (let j = 0; j < data.length; ++j) {
        if (data[j].includes("batt")) {
          //_batt='3.312'
          const batt: string = Utils.getValueFromKV(data[j]);
          if (batt != "") {
            encoder.setFloat("batt", parseFloat(batt));
          }
        } else if (data[j].includes("temp")) {
          //_temp='28'
          const temp: string = Utils.getValueFromKV(data[j]);
          if (temp != "") {
            encoder.setFloat("temp", parseFloat(temp));
          }
        } else if (data[j].includes("power")) {
          //_power='12.070'
          const power: string = Utils.getValueFromKV(data[j]);
          if (power != "") {
            encoder.setFloat("power", parseFloat(power));
          }
        } else if (data[j].includes("Ignition")) {
          //Ignition='1'>*4E
          const ignition: string = Utils.getValueFromKV(data[j]);
          if (ignition != "") {
            encoder.setFloat("ignition", parseFloat(ignition));
          }
        }
      }

      encoder.popObject();
    }
  }

  setOutputJSON("{" + encoder.toString() + "}");

  return 0;
}

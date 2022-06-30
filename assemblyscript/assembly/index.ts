import { setOutputJSON, log, getInputBufferAsString } from "orbit-sdk-assemblyscript";

import { JSONEncoder } from "assemblyscript-json";
import * as Obd2Parser from "./obd_parser";

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
  const isFlat = false;
  var isSfalPosAcquired = false;
  var isSfalEventAcquired = false;
  var isGPRMCAcquired = false;

  for (let i = 0; i < lines.length; ++i) {
    const data = lines[i].includes("sfal") ? lines[i].split(" ") : lines[i].split(",");
    if (data.length == 0) {
      continue;
    }

    const label = data[0];
    var pre = "";
    if (label == "GPRMC" && !isGPRMCAcquired) {
      //GPRMC,045752.000,V,3542.3459,N,13946.6537,E,,,250122,,*16
      isGPRMCAcquired = true;
      pre = "gprmc";
      encoder.pushObject(pre);
      pre = "";

      for (let j = 0; j < data.length; ++j) {
        encoder.setString(pre + "v" + j.toString(), data[j]);
      }

      const latitude: number = Obd2Parser.parseLatLon(data[3], data[4]);
      if (latitude !== 0) {
        encoder.setFloat(pre + "latitude", latitude);
      }

      const longitude: number = Obd2Parser.parseLatLon(data[5], data[6]);
      if (longitude !== 0) {
        encoder.setFloat(pre + "longitude", longitude);
      }

      encoder.popObject();
    } else if (label == "<sfal.pos" && !isSfalPosAcquired) {
      isSfalPosAcquired = true;

      pre = "obdPos";
      encoder.pushObject(pre);
      pre = "";

      for (let j = 0; j < data.length; ++j) {
        if (data[j].includes("_speed")) {
          //_speed='0.00'
          const speed: string = Obd2Parser.getValueFromKV(data[j]);
          if (speed != "") {
            encoder.setFloat(pre + "speed", parseFloat(speed));
          }
        }
      }

      if (!isFlat) {
        encoder.popObject();
      }

      //<sfal.event _batt='3.312' _temp='28' _power='12.070' Ignition='1'>*4E
    } else if (label == "<sfal.event" && !isSfalEventAcquired) {
      isSfalEventAcquired = true;

      pre = "obdEvent";
      encoder.pushObject(pre);
      pre = "";

      for (let j = 0; j < data.length; ++j) {
        if (data[j].includes("batt")) {
          //_batt='3.312'
          const batt: string = Obd2Parser.getValueFromKV(data[j]);
          if (batt != "") {
            encoder.setFloat(pre + "batt", parseFloat(batt));
          }
        } else if (data[j].includes("temp")) {
          //_temp='28'
          const temp: string = Obd2Parser.getValueFromKV(data[j]);
          if (temp != "") {
            encoder.setFloat(pre + "temp", parseFloat(temp));
          }
        } else if (data[j].includes("power")) {
          //_power='12.070'
          const power: string = Obd2Parser.getValueFromKV(data[j]);
          if (power != "") {
            encoder.setFloat(pre + "power", parseFloat(power));
          }
        } else if (data[j].includes("Ignition")) {
          //Ignition='1'>*4E
          const ignition: string = Obd2Parser.getValueFromKV(data[j]);
          if (ignition != "") {
            encoder.setFloat(pre + "ignition", parseFloat(ignition));
          }
        }
      }

      encoder.popObject();
    }
  }

  setOutputJSON("{" + encoder.toString() + "}");

  return 0;
}

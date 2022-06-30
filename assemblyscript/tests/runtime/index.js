/**
 * @file SORACOM Orbit compatible WASM runtime for given module and input
 * @author SORACOM, INC.
 * @copyright 2020 SORACOM, INC. All rights reserved.
 * @version 0.0.1
 */

const { readFileSync } = require("fs");
const { instantiateSync } = require("@assemblyscript/loader/umd");

class Runtime {
  /**
   * Initialize WASM runtime with predefined imports
   *
   * @param {string} modulePath - absolute path to wasm module
   * @param {object} input - Orbit input
   */
  constructor(modulePath, input) {
    const module = instantiateSync(readFileSync(modulePath), {
      /* eslint-disable no-unused-vars */
      // unused parameters are there in order to make function signature identical to Orbit runtime SDK
      env: {
        orbit_log(ptr, len) {
          let arr = module.exports.__getArrayBuffer(ptr);
          console.log(String.fromCharCode.apply(null, new Uint8Array(arr)));
        },
        orbit_get_input_buffer(ptr, len) {
          let buffer;
          switch (input.contentType) {
            case "application/octet-stream":
              buffer = Buffer.from(input.body, "base64");
              break;
            case "text/csv":
            case "text/plain":
              buffer = Buffer.from(input.body);
              break;
            default:
              buffer = Buffer.from(JSON.stringify(JSON.parse(input.body)));
              break;
          }
          let arr = module.exports.__getUint8ArrayView(ptr - 32); // dataStart
          for (let i = 0; i < len; i++) {
            arr[i] = buffer[i];
          }
          return len;
        },
        orbit_get_input_buffer_len() {
          let buffer;
          switch (input.contentType) {
            case "application/octet-stream":
              buffer = Buffer.from(input.body, "base64");
              break;
            case "text/csv":
            case "text/plain":
              buffer = Buffer.from(input.body);
              break;
            default:
              buffer = Buffer.from(JSON.stringify(JSON.parse(input.body)));
              break;
          }
          return buffer.length;
        },
        orbit_get_tag_value(nptr, nlen, vptr, vlen) {
          let arr = module.exports.__getArrayBuffer(nptr);
          let name = String.fromCharCode.apply(null, new Uint8Array(arr));
          let buffer = null;
          if ("tags" in input && name in input.tags) {
            buffer = Buffer.from(input.tags[name]);
          }
          arr = module.exports.__getUint8ArrayView(vptr - 32); // dataStart
          for (let i = 0; i < vlen; i++) {
            arr[i] = buffer[i];
          }
          return vlen;
        },
        orbit_get_tag_value_len(ptr, len) {
          let arr = module.exports.__getArrayBuffer(ptr);
          let name = String.fromCharCode.apply(null, new Uint8Array(arr));
          if ("tags" in input && name in input.tags) {
            return input.tags[name].length;
          }
          return 0;
        },
        orbit_get_source_value(nptr, nlen, vptr, vlen) {
          let arr = module.exports.__getArrayBuffer(nptr);
          let name = String.fromCharCode.apply(null, new Uint8Array(arr));
          let buffer = null;
          if ("source" in input && name in input.source) {
            buffer = Buffer.from(input.source[name]);
          }
          arr = module.exports.__getUint8ArrayView(vptr - 32); // dataStart
          for (let i = 0; i < vlen; i++) {
            arr[i] = buffer[i];
          }
          return vlen;
        },
        orbit_get_source_value_len(ptr, len) {
          let arr = module.exports.__getArrayBuffer(ptr);
          let name = String.fromCharCode.apply(null, new Uint8Array(arr));
          if ("source" in input && name in input.source) {
            return input.source[name].length;
          }
          return 0;
        },
        orbit_has_location() {
          if ("location" in input) {
            return 1;
          }
          return 0;
        },
        orbit_get_location_lat() {
          return input.location.lat;
        },
        orbit_get_location_lon() {
          return input.location.lon;
        },
        orbit_get_timestamp() {
          // eslint-disable-next-line no-undef
          return BigInt(input.timestamp);
        },
        orbit_set_output(ptr, len) {
          let arr = module.exports.__getArrayBuffer(ptr);
          module.output = String.fromCharCode.apply(null, new Uint8Array(arr));
        },
        orbit_set_output_content_type(ptr, len) {
          let arr = module.exports.__getArrayBuffer(ptr);
          module.outputContentType = String.fromCharCode.apply(null, new Uint8Array(arr));
        },
        orbit_get_userdata(ptr, len) {
          let buffer;
          if (typeof input.userdata === "undefined") {
            buffer = Buffer.from("");
          } else {
            buffer = Buffer.from(input.userdata);
          }
          let arr = module.exports.__getUint8ArrayView(ptr - 32); // dataStart
          for (let i = 0; i < len; i++) {
            arr[i] = buffer[i];
          }
          return len;
        },
        orbit_get_userdata_len() {
          if (typeof input.userdata === "undefined") {
            return 0;
          } else {
            let buffer = Buffer.from(input.userdata);
            return buffer.length;
          }
        },
      },
      // 256 pages = 64 * 256 = 16 MiB
      memory: new WebAssembly.Memory({initial: 1, maximum: 256})
      /* eslint-enable no-unused-vars */
    });

    this.input = input;
    this.module = module;
  }

  /**
   * Execute module
   *
   * @returns {Object} - result of execution
   */
  exec() {
    return {
      resultCode: this.module.exports[this.input.direction].call(),
      contentType: this.module.outputContentType,
      body: JSON.parse(this.module.output),
    };
  }
}

module.exports = { Runtime };

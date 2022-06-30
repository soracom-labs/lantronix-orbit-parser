// @ts-ignore
// @ts-ignore
/**
 * @file defines SORACOM Orbit SDK
 * @author SORACOM, INC.
 * @copyright 2020 SORACOM, INC. All rights reserved.
 * @version 0.1.0
 */

// Orbit environment provided functions
// @ts-ignore
@external("env", "orbit_log")
export declare function orbit_log(message: i32, len: i32): void;
// @ts-ignore
@external("env", "orbit_get_input_buffer")
export declare function orbit_get_input_buffer(ptr: i32, len: i32): i32;
// @ts-ignore
@external("env", "orbit_get_input_buffer_len")
export declare function orbit_get_input_buffer_len(): i32;
// @ts-ignore
@external("env", "orbit_get_tag_value")
export declare function orbit_get_tag_value(name_ptr: i32, name_len: i32, value_ptr: i32, value_len: i32): i32;
// @ts-ignore
@external("env", "orbit_get_tag_value_len")
export declare function orbit_get_tag_value_len(name_ptr: i32, name_len: i32): i32;
// @ts-ignore
@external("env", "orbit_get_source_value")
export declare function orbit_get_source_value(name_ptr: i32, name_len: i32, value_ptr: i32, value_len: i32): i32;
// @ts-ignore
@external("env", "orbit_get_source_value_len")
export declare function orbit_get_source_value_len(name_ptr: i32, name_len: i32): i32;
// @ts-ignore
@external("env", "orbit_has_location")
export declare function orbit_has_location(): i32;
// @ts-ignore
@external("env", "orbit_get_location_lat")
export declare function orbit_get_location_lat(): f64;
// @ts-ignore
@external("env", "orbit_get_location_lon")
export declare function orbit_get_location_lon(): f64;
// @ts-ignore
@external("env", "orbit_get_timestamp")
export declare function orbit_get_timestamp(): i64;
// @ts-ignore
@external("env", "orbit_set_output")
export declare function orbit_set_output(json: i32, len: i32): void;
// @ts-ignore
@external("env", "orbit_set_output_content_type")
export declare function orbit_set_output_content_type(type: i32, len: i32): void;
@external("env", "orbit_get_userdata")
export declare function orbit_get_userdata(ptr: i32, len: i32): i32;
// @ts-ignore
@external("env", "orbit_get_userdata_len")
export declare function orbit_get_userdata_len(): i32;

export class Location {
  // eslint-disable-next-line no-unused-vars
  constructor(public lat: f64, public lon: f64) {}
}

// pass these function/class to AssemblyScript compiler (asc) as `--use abort=sdk/env/abort --use Date=sdk/env/Date`
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
export function abort(message: string | null, fileName: string | null, lineNumber: u32, columnNumber: u32): void {
  let output = lineNumber.toString() + ":" + columnNumber.toString();
  if (fileName !== null) {
    output += fileName + ":" + output;
  }
  if (message !== null) {
    output += output + ":" + message;
  }
  log(output);
}

// will throw an runtime error as no Date support on Orbit runtime at this moment
export class Date {
  static UTC(year: i32, month: i32, day: i32, hour: i32, minute: i32, second: i32, millisecond: i32): i64 { throw new Error("unreachable"); }
  static now(): i64 { throw new Error("unreachable"); }
  constructor(value: i64) { throw new Error("unreachable"); }
  getTime(): i64 { throw new Error("unreachable"); }
  setTime(value: i64): i64 { throw new Error("unreachable"); }
}

export class Math {
  static random(): f64 { throw new Error("unreachable"); }
}
/* eslint-enable prettier/prettier */
/* eslint-enable no-unused-vars */

/**
 * log string
 * @param message string to log
 */
export function log(message: string): void {
  const content = String.UTF8.encode(message);
  orbit_log(toPointer(content), content.byteLength);
}

/**
 * get input buffer as Uint8Array from environment
 */
export function getInputBuffer(): Uint8Array {
  const arr = new Uint8Array(orbit_get_input_buffer_len());
  orbit_get_input_buffer(uint8ArrayToPointer(arr), arr.length);
  return arr;
}

/**
 * get input buffer as string from environment
 */
export function getInputBufferAsString(): string {
  return toUTF8String(getInputBuffer());
}

/**
 * get tag value from input data
 *
 * @param name tag name
 */
export function getTagValue(name: string): string {
  const n = String.UTF8.encode(name);
  const arr = new Uint8Array(orbit_get_tag_value_len(toPointer(n), n.byteLength));
  orbit_get_tag_value(toPointer(n), n.byteLength, uint8ArrayToPointer(arr), arr.length);
  return toUTF8String(arr);
}

/**
 * get source value from input data
 *
 * @param name source property name
 */
export function getSourceValue(name: string): string {
  const n = String.UTF8.encode(name);
  const arr = new Uint8Array(orbit_get_source_value_len(toPointer(n), n.byteLength));
  orbit_get_source_value(toPointer(n), n.byteLength, uint8ArrayToPointer(arr), arr.length);
  return toUTF8String(arr);
}

/**
 * get location information from input data
 */
export function getLocation(): Location {
  if (orbit_has_location() == 0) {
    return new Location(NaN, NaN);
  }
  return new Location(orbit_get_location_lat(), orbit_get_location_lon());
}

/**
 * get timestamp from input data
 */
export function getTimestamp(): i64 {
  return orbit_get_timestamp();
}

/**
 * set output JSON
 *
 * @param json JSON string
 */
export function setOutputJSON(json: string): void {
  const contentType = String.UTF8.encode("application/json");
  const content = String.UTF8.encode(json);

  orbit_set_output_content_type(toPointer(contentType), contentType.byteLength);
  orbit_set_output(toPointer(content), content.byteLength);
}

/**
 * get userdata as string from environment
 */
export function getUserdata(): string {
  const arr = new Uint8Array(orbit_get_userdata_len());
  orbit_get_userdata(uint8ArrayToPointer(arr), arr.length);
  return toUTF8String(arr);
}

/*
 * Private utilities
 */

function toUTF8String(arr: Uint8Array): string {
  return String.UTF8.decode(arr.buffer);
}

/**
 * returns pointer to the given type
 *
 * @param t object
 */
// @ts-ignore
@inline
function toPointer<T>(t: T): i32 {
  return changetype<i32>(t);
}

/**
 * returns pointer to start of the data of given Uint8Array
 * actual data begins at #dataStart (usize) position
 * See https://docs.assemblyscript.org/details/memory#internals
 *
 * to work with the runtime we have to pass pointer of actual data
 *
 * @param arr array
 */
// @ts-ignore
@inline
function uint8ArrayToPointer(arr: Uint8Array): i32 {
  // @ts-ignore (as documented but not in .d.ts)
  return arr.dataStart as i32;
}

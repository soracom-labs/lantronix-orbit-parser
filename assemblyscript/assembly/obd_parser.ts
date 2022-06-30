export function parseLatLon(raw: string, cardinalPoint: string): number {
  const sign: number = cardinalPoint === "S" || cardinalPoint === "W" ? -1 : 1;
  const pointPos = raw.indexOf(".");
  let deg: number = parseInt(raw.substr(0, pointPos - 2));
  let min: number = parseInt(raw.substr(pointPos - 2, 2));
  let sec: number = parseFloat("0." + raw.substr(pointPos + 1, raw.length));

  deg = Math.abs(Math.round(deg * 1000000));
  min = Math.abs(Math.round(min * 1000000));
  sec = Math.abs(Math.round(sec * 60) * 1000000);

  return (Math.round(deg + min / 60 + sec / 3600) * sign) / 1000000;
}

export function getValueFromKV(kv: string): string {
  if (kv == "" || kv == null) {
    return "";
  }
  var startAt = kv.indexOf("'");
  var endAt = kv.lastIndexOf("'");
  if (startAt == -1 || endAt == -1) {
    return "";
  }
  return kv.substring(startAt + 1, endAt);
}

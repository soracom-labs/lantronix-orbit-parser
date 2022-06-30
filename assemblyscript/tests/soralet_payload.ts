export interface SoraletPayload {
  codeSrn: string;
  direction: "uplink" | "downlink";
  contentType: "application/json" | "application/octet-stream" | "text/plain" | string;
  encodingType?: "plain" | "base64";
  body: string;
  source: {
    resourceType: "Sigfox" | "Subscriber" | "Lora" | "Device";
    resourceId: string;
  };
  tags?: { [key: string]: string | number };
  location?: { lat: number; lon: number };
  userdata?: string;
  timestamp: number;
}

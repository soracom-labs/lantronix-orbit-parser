import { join } from "path";
import { Runtime } from "./runtime";
import { inputs } from "./inputs";
import { writeFileSync } from "fs";
import { SoraletPayload } from "./soralet_payload";

describe("soralet test suite", (): void => {
  let num = 0;
  for (const input of inputs) {
    describe("Environment", () => {
      test("input has expected props", () => {
        expect(input).toHaveProperty("body");
        expect(input).toHaveProperty("direction");
        expect(input).toHaveProperty("contentType");
      });
    });

    writeFileSync(
      join(__dirname, "inputs", `${++num}.json`),
      JSON.stringify(toSoracomCliCompatibleJson(input), null, 2),
    );

    const runtime = new Runtime(join(__dirname, "..", "build", "soralet.wasm"), input);
    const result = runtime.exec();

    describe("WASM", () => {
      test("result code should be 0", () => {
        expect(result.resultCode).toBe(0);
      });

      test("content type should be application/json", () => {
        expect(result.contentType).toBe("application/json");
      });

      test("result should be expected", () => {
        expect(result.body).toMatchSnapshot();
      });
    });
  }
});

// rename `body` to `payload` to compatible with `soracom soralets exec` command's `body` parameter
function toSoracomCliCompatibleJson(input: SoraletPayload): any {
  const j = JSON.parse(JSON.stringify(input));
  j.payload = j.body;
  delete j.body;
  return j;
}

import logger from ".";
import * as Env from "dotenv";
const CONFIG = "./src/logger.spec.json";

describe("Logger", () => {
    test("Default Prod Config", () => {
        const log = logger();
        expect(log.config.level).toBe("verbose");
    });
    test("Custom Prod Config", () => {
        const log = logger(CONFIG);
        expect(log.config.level).toBe("custom prod");
    });
    test("DEV_MODE env", () => {
        expect(process.env.DEV_MODE).toBeFalsy();
    });
    test("DEV_MODE env", () => {
        Env.config();
        expect(process.env.DEV_MODE).toBeTruthy();
    });
    test("Default Dev Config", () => {
        const log = logger();
        // log.info("JEST", "hi");
        expect(log.config.level).toBe("debug");
    });
    test("Custom Dev Config", () => {
        const log = logger(CONFIG);
        expect(log.config.level).toBe("custom debug");
    });
});
import winston from "winston";
import { SPLAT } from "triple-beam";
import util from "util";
import { isPrimitive } from "ts-raz-util";
import defaultConfig from "./logger.json";
import fs from "fs";

export interface Root {
    production: Config;
    dev: Config;
}

export interface Config {
    silent: boolean;
    level: string;
    toFile: boolean;
    inspect: Inspect;
    format: Format;
}

export interface Format {
    timestamp: boolean;
    pid: boolean;
    level: boolean;
}

export interface Inspect {
    depth: number;
    showHidden: boolean;
}

export interface Logger extends winston.Logger {
    config: Config;
}

const { combine, timestamp, printf, errors } = winston.format;

export default function logger(path?: string) {
    const TYPE = process.env.DEV_MODE ? "dev" : "production";

    if (path && fs.existsSync(path)) {
        try {
            const config: Root = JSON.parse(fs.readFileSync(path, "utf8"));
            return create(config[TYPE]);
        }
        catch (e) {
            throw new Error(e);
        }
    }
    return create(defaultConfig[TYPE]);
}

function inspect(val: any, cfg: Config, execlude?: any) {
    if (execlude && val instanceof Error)
        return "";
    const primitive = isPrimitive(val);
    const prefix = primitive ? "" : "\n";
    return prefix + (primitive ? val : util.inspect(val, cfg.inspect));
}

function create(cfg: Config) {
    const logFormat = printf(({ level, message, timestamp, stack, [SPLAT]: args = [] }) => {
        const stackTrace = stack ? `\n${stack}` : "";
        const rest = args.map((v: any) => inspect(v, cfg, stack)).join(", ");
        let msg = "";
        if (cfg.format.timestamp)
            msg = timestamp;
        if (cfg.format.pid)
            msg += ` pid: ${process.pid}`;
        if (cfg.format.level)
            msg += ` ${level}`;
        if (msg.length) {
            msg.trim();
            msg += ": ";
        }
        return `${msg}${inspect(message, cfg)} ${rest}${stackTrace}`;
    });

    const option: winston.LoggerOptions = {
        level: cfg.level,
        format: combine(timestamp({ format: "MM/DD/YYYY-HH:mm:ss.SSS" }), errors({ stack: true }), logFormat),
        exitOnError: false
    };

    if (cfg.silent)
        option.silent = true;
    else {
        option.transports = [new winston.transports.Console()];
        if (cfg.toFile) {
            option.exceptionHandlers = [new winston.transports.File({ filename: "./logs/exceptions.log" })];
            option.transports.push(new winston.transports.File({ filename: "./logs/combined.log" }));
        }
    }
    const logger = winston.createLogger(option) as Logger;
    logger.config = cfg;
    return logger;
}
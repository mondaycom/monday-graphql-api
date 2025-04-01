import fs from "fs";
import path from "path";
import winston, { createLogger, format } from 'winston';
const { combine, timestamp, printf, colorize } = format;

const customFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});
const getLogLevel = () => {
  if (process.env.DEBUG && JSON.parse(process.env.DEBUG)) {
    return 'debug';
  }
  if (process.env.LOG_LEVEL) {
    return process.env.LOG_LEVEL;
  }
  return 'debug';
};
const folderPath = path.join(__dirname, "bb-mcp/logs")
fs.mkdirSync(folderPath, {
  recursive: true
})
const logFile = 'bb.server.log'
fs.openSync(logFile, "w")
export const logger = createLogger({
  level: getLogLevel(),
  format: combine(colorize(), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), customFormat),
  transports: [
    // Write logs to a file
    new winston.transports.File({ filename: logFile, dirname: folderPath }),
    // Output logs to stderr (so as not to interfere with MCP protocol on stdout)
    new winston.transports.Console({ stderrLevels: ['error', 'warn', 'info', 'debug'] })
  ],
});

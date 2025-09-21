import winston from "winston";

// Define logging levels and format
const logFormat = winston.format.combine(
    // Add a timestamp to each log
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  // Colorize the log level (e.g., 'info' in green, 'error' in red)
  winston.format.colorize(),
   // Customize the log message output
  winston.format.printf(
    (info) => `[${info.timestamp}] ${info.level}: ${info.message}`
  )
);


// Create logger instance
export const logger = winston.createLogger({
  level: "info",
  format: logFormat,
  transports: [
    new winston.transports.Console(), // logs to console
    // You can add file transport if needed:
    // new winston.transports.File({ filename: 'logs/app.log', level: 'info' })
  ],
});



// Example usage helper functions
export const logInfo = (message) => logger.info(message);
export const logError = (message) => logger.error(message);
export const logWarn = (message) => logger.warn(message);

















// error > warn > info > http > verbose > debug > silly

/*
    | Log method       | Will be logged? |
| ---------------- | --------------- |
| `logger.error()` | ✅ Yes           |
| `logger.warn()`  | ✅ Yes           |
| `logger.info()`  | ✅ Yes           |
| `logger.http()`  | ❌ No            |
| `logger.debug()` | ❌ No            |
| `logger.silly()` | ❌ No            |

*/
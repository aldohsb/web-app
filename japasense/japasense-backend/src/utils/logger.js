import { isDevelopment } from '../config/environment.js';

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

class Logger {
  constructor() {
    this.enabled = true;
  }
  
  formatMessage(level, message, data = null) {
    const timestamp = new Date().toISOString();
    let formatted = `[${timestamp}] [${level}] ${message}`;
    
    if (data && isDevelopment) {
      formatted += `\n${JSON.stringify(data, null, 2)}`;
    }
    
    return formatted;
  }
  
  info(message, data = null) {
    if (!this.enabled) return;
    console.log(
      `${colors.blue}${this.formatMessage('INFO', message, data)}${colors.reset}`
    );
  }
  
  success(message, data = null) {
    if (!this.enabled) return;
    console.log(
      `${colors.green}${this.formatMessage('SUCCESS', message, data)}${colors.reset}`
    );
  }
  
  warn(message, data = null) {
    if (!this.enabled) return;
    console.warn(
      `${colors.yellow}${this.formatMessage('WARN', message, data)}${colors.reset}`
    );
  }
  
  error(message, error = null) {
    if (!this.enabled) return;
    const errorData = error ? {
      message: error.message,
      stack: isDevelopment ? error.stack : undefined,
    } : null;
    
    console.error(
      `${colors.red}${this.formatMessage('ERROR', message, errorData)}${colors.reset}`
    );
  }
  
  debug(message, data = null) {
    if (!this.enabled || !isDevelopment) return;
    console.log(
      `${colors.magenta}${this.formatMessage('DEBUG', message, data)}${colors.reset}`
    );
  }
}

const logger = new Logger();

export default logger;
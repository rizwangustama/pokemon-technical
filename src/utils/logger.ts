const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const GRAY = '\x1b[90m';
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const MAGENTA = '\x1b[35m';
const CYAN = '\x1b[36m';

function getTimestamp(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const ms = String(now.getMilliseconds()).padStart(3, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${ms}`;
}

export const logger = {
  /** Logs system startup and server operations */
  logSystem(message: string): void {
    console.log(`${GRAY}[${getTimestamp()}]${RESET} ${CYAN}[SYSTEM]${RESET} ${BOLD}${message}${RESET}`);
  },

  /** Logs client actions forwarded from the browser */
  logClient(action: string, details?: string): void {
    const detailsStr = details ? ` - ${GRAY}${details}${RESET}` : '';
    console.log(
      `${GRAY}[${getTimestamp()}]${RESET} ${GREEN}[CLIENT]${RESET} ${BOLD}${action}${RESET}${detailsStr}`
    );
  },

  /** Logs incoming client API requests on the backend */
  logServerRequest(method: string, endpoint: string, queryParams?: string, timestamp?: string, reqBody?: unknown): void {
    const queryStr = queryParams ? `?${queryParams}` : '';
    const tsStr = timestamp ? ` ${GRAY}(Timestamp: ${timestamp})${RESET}` : '';
    const bodyStr = reqBody !== undefined ? ` | Body: ${GRAY}${JSON.stringify(reqBody)}${RESET}` : '';

    console.log(
      `${GRAY}[${getTimestamp()}]${RESET} ${BLUE}[SERVER_REQ]${RESET} ${BOLD}${method} ${endpoint}${RESET}${queryStr}${bodyStr}${tsStr}`
    );
  },

  /** Logs completed API response details, including duration and upstream queries */
  logServerResponse(
    method: string,
    endpoint: string,
    status: number,
    duration: number,
    upstreamUrl?: string,
    details?: string,
    resBody?: unknown
  ): void {
    let statusColor = GREEN;
    if (status >= 400 && status < 500) statusColor = YELLOW;
    if (status >= 500) statusColor = RED;

    const upstreamStr = upstreamUrl ? ` | Upstream: ${GRAY}${upstreamUrl}${RESET}` : '';
    const detailsStr = details ? ` | ${details}` : '';

    let resBodyStr = '';
    if (resBody !== undefined) {
      resBodyStr = ` | Data: ${GRAY}${JSON.stringify(resBody)}${RESET}`;
    }

    console.log(
      `${GRAY}[${getTimestamp()}]${RESET} ${MAGENTA}[SERVER_RES]${RESET} ${BOLD}${method} ${endpoint}${RESET} - ` +
      `${statusColor}${status}${RESET} - ${YELLOW}${duration.toFixed(1)}ms${RESET}${detailsStr}${upstreamStr}${resBodyStr}`
    );
  },

  /** Logs errors caught on client or server */
  logError(action: string, error: unknown): void {
    const errorMsg = error instanceof Error ? error.stack || error.message : String(error);
    console.error(
      `${GRAY}[${getTimestamp()}]${RESET} ${RED}[ERROR]${RESET} ${BOLD}${action}${RESET}\n${RED}${errorMsg}${RESET}`
    );
  },
};

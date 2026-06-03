import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/utils/logger';

export async function POST(request: NextRequest) {
  const startTime = performance.now();
  const method = request.method;
  const endpoint = '/api/logs';

  try {
    const body = await request.json();
    logger.logServerRequest(method, endpoint, undefined, undefined, body);

    const { action, details } = body;

    if (!action) {
      const duration = performance.now() - startTime;
      const errorRes = { error: 'Missing action field' };
      logger.logServerResponse(method, endpoint, 400, duration, undefined, 'Validation Failed', errorRes);
      return NextResponse.json(errorRes, { status: 400 });
    }

    logger.logClient(action, details);

    const duration = performance.now() - startTime;
    const successRes = { success: true };
    logger.logServerResponse(method, endpoint, 200, duration, undefined, 'Client log registered', successRes);

    return NextResponse.json(successRes);
  } catch (error) {
    const duration = performance.now() - startTime;
    logger.logError('Logs API Route Error', error);
    const errorRes = { error: 'Internal Server Error' };
    logger.logServerResponse(method, endpoint, 500, duration, undefined, 'Error logging payload', errorRes);
    return NextResponse.json(errorRes, { status: 500 });
  }
}

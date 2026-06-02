import { generateSignature } from './crypto';

/**
 * Validates request signing headers (HMAC-SHA256 & Timestamp freshness).
 * Returns a 401 Response if validation fails, or null if valid.
 */
export async function verifyRequestSignature(
  request: Request,
  endpointPath: string
): Promise<Response | null> {
  const clientTimestamp = request.headers.get('x-timestamp');
  const clientSignature = request.headers.get('x-signature');

  // 1. Assert signature headers are present
  if (!clientTimestamp || !clientSignature) {
    return Response.json(
      { error: 'Unauthorized: Missing request signing headers' },
      { status: 401 }
    );
  }

  // 2. Validate timestamp freshness (Replay attack protection)
  const requestTime = parseInt(clientTimestamp, 10);
  const timeDifference = Math.abs(Date.now() - requestTime);
  if (isNaN(requestTime) || timeDifference > 5 * 60 * 1000) {
    return Response.json(
      { error: 'Unauthorized: Request expired or timestamp invalid' },
      { status: 401 }
    );
  }

  // 3. Verify signature authenticity
  const expectedMessage = `${clientTimestamp}:${endpointPath}`;
  const expectedSignature = await generateSignature(
    expectedMessage,
    // Import clientEnv dynamically to avoid circular or early client bundle leakages
    (await import('@/lib/env.client')).env.NEXT_PUBLIC_SIGNATURE_SECRET
  );

  if (clientSignature !== expectedSignature) {
    return Response.json(
      { error: 'Unauthorized: Invalid request signature' },
      { status: 401 }
    );
  }

  return null;
}

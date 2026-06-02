import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/lib/env.server';
import { env as clientEnv } from '@/lib/env.client';
import { generateSignature } from '@/utils/crypto';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const clientTimestamp = request.headers.get('x-timestamp');
    const clientSignature = request.headers.get('x-signature');

    // 1. Assert headers are present
    if (!clientTimestamp || !clientSignature) {
      return NextResponse.json(
        { error: 'Unauthorized: Missing request signing headers' },
        { status: 401 }
      );
    }

    // 2. Validate timestamp freshness (Replay attack protection)
    const requestTime = parseInt(clientTimestamp, 10);
    const timeDifference = Math.abs(Date.now() - requestTime);
    if (isNaN(requestTime) || timeDifference > 5 * 60 * 1000) {
      return NextResponse.json(
        { error: 'Unauthorized: Request expired or timestamp invalid' },
        { status: 401 }
      );
    }

    // 3. Reconstruct client URL and verify signature match
    const { path } = await params;
    const pathString = path.join('/');
    const urlPathReconstructed = `/${pathString}`;
    const expectedMessage = `${clientTimestamp}:${urlPathReconstructed}`;

    const expectedSignature = await generateSignature(
      expectedMessage,
      clientEnv.NEXT_PUBLIC_SIGNATURE_SECRET
    );

    if (clientSignature !== expectedSignature) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid request signature' },
        { status: 401 }
      );
    }

    // 4. Retrieve query parameters
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();

    // 5. Construct target URL using the secret POKEAPI_URL
    const targetUrl = `${env.POKEAPI_URL}/${pathString}${queryString ? `?${queryString}` : ''
      }`;

    // Perform server-side call
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 3600, // Cache PokeAPI response for 1 hour at Next.js server level
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Upstream error: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Proxy Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error in API Proxy' },
      { status: 500 }
    );
  }
}

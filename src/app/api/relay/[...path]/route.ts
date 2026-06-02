import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/lib/env.server';
import { verifyRequestSignature } from '@/utils/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const pathString = path.join('/');

    // 1. Verify request signature & timestamp freshness
    const authError = await verifyRequestSignature(request, `/relay/${pathString}`);
    if (authError) {
      return authError;
    }

    // 4. Retrieve query parameters
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();

    // 5. Construct target URL using the secret POKEAPI_URL
    const targetUrl = `${env.POKEAPI_URL}/${pathString}${
      queryString ? `?${queryString}` : ''
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
    console.error('API Proxy Relay Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error in API Proxy Relay' },
      { status: 500 }
    );
  }
}

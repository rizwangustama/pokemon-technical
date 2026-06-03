import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/lib/env.server';
import { verifyRequestSignature } from '@/utils/auth';
import { getPokemonArtworkUrl } from '@/utils/index';
import { logger } from '@/utils/logger';
import {
  pokeApiPokemonDetailResponseSchema,
  pokemonDetailResponseSchema,
} from '@/schemas';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = performance.now();
  const method = request.method;
  let id = '';

  try {
    const resolvedParams = await params;
    id = resolvedParams.id.toLowerCase();
  } catch (err) {
    const duration = performance.now() - startTime;
    logger.logError('Detail Params Error', err);
    logger.logServerResponse(method, '/api/pokemon/[id]', 400, duration, undefined, 'Invalid params');
    return NextResponse.json({ error: 'Invalid URL parameters' }, { status: 400 });
  }

  const endpoint = `/api/pokemon/${id}`;
  const xTimestamp = request.headers.get('X-Timestamp') ?? undefined;

  // Log incoming request
  logger.logServerRequest(method, endpoint, undefined, xTimestamp);

  try {
    // 1. Verify request signature & timestamp freshness
    const authError = await verifyRequestSignature(request, `/pokemon/${id}`);
    if (authError) {
      const duration = performance.now() - startTime;
      logger.logServerResponse(method, endpoint, authError.status, duration, undefined, 'Signature validation failed');
      return authError;
    }

    // 4. Fetch raw data from PokeAPI
    const targetUrl = `${env.POKEAPI_URL}/pokemon/${id}`;
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 3600, // Cache for 1 hour
      },
    });

    if (!response.ok) {
      const duration = performance.now() - startTime;
      logger.logServerResponse(method, endpoint, response.status, duration, targetUrl, `Upstream detail error: ${response.statusText}`);
      return NextResponse.json(
        { error: `Upstream error: ${response.statusText}` },
        { status: response.status }
      );
    }

    const rawData = await response.json();

    // Validate raw upstream response using Zod
    const validatedRaw = pokeApiPokemonDetailResponseSchema.parse(rawData);

    // 5. Transmute and normalize into client DTO format
    const transformedData = {
      success: true,
      message: 'Pokemon details retrieved successfully',
      data: {
        id: validatedRaw.id,
        name: validatedRaw.name,
        height: validatedRaw.height,
        weight: validatedRaw.weight,
        imageUrl: getPokemonArtworkUrl(validatedRaw.id),
        types: validatedRaw.types.map((t) => t.type.name),
        abilities: validatedRaw.abilities.map((a) => a.ability.name),
        stats: validatedRaw.stats.map((s) => ({
          name: s.stat.name,
          value: s.base_stat,
        })),
      },
    };

    // Validate the transformed data with Zod output schema
    const validatedTransformed = pokemonDetailResponseSchema.parse(transformedData);

    const duration = performance.now() - startTime;
    logger.logServerResponse(
      method,
      endpoint,
      200,
      duration,
      targetUrl,
      `Returned details for ${validatedRaw.name}`,
      validatedTransformed
    );

    const responseHeaders = new Headers();
    responseHeaders.set('x-response-time', `${duration.toFixed(1)}ms`);
    responseHeaders.set('x-server-log', `Served details for ${validatedRaw.name}`);

    return NextResponse.json(validatedTransformed, {
      headers: responseHeaders,
    });
  } catch (error) {
    const duration = performance.now() - startTime;
    logger.logError(`Pokemon Detail API Route Error (${id})`, error);
    logger.logServerResponse(method, endpoint, 500, duration, undefined, 'Internal Server Error');
    return NextResponse.json(
      { error: 'Internal Server Error in API Route' },
      { status: 500 }
    );
  }
}

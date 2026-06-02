import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/lib/env.server';
import { verifyRequestSignature } from '@/utils/auth';
import { extractIdFromUrl, getPokemonArtworkUrl } from '@/utils/index';
import {
  pokeApiPokemonListResponseSchema,
  pokemonListResponseSchema,
  pokeApiTypeDetailResponseSchema,
} from '@/schemas/pokemon.schema';

export async function GET(request: NextRequest) {
  try {
    // 1. Verify request signature & timestamp freshness
    const authError = await verifyRequestSignature(request, '/pokemon/list');
    if (authError) {
      return authError;
    }

    // 4. Retrieve pagination, search, and type query parameters
    const { searchParams } = new URL(request.url);
    
    let limit = parseInt(searchParams.get('limit') ?? '20', 10);
    if (isNaN(limit) || limit <= 0) {
      limit = 20;
    }

    let page = parseInt(searchParams.get('page') ?? '1', 10);
    if (isNaN(page) || page <= 0) {
      page = 1;
    }

    const offset = (page - 1) * limit;

    const search = searchParams.get('search')?.trim().toLowerCase() ?? '';
    const typeFilter = (searchParams.get('types') ?? searchParams.get('type'))?.trim().toLowerCase() ?? '';

    let results: Array<{ name: string; url: string }> = [];
    let totalCount = 0;
    let hasNextPage = false;

    if (typeFilter) {
      // 5a. Fetch Pokemon associated with the requested Type
      // Next.js will cache this response for 24 hours.
      const targetUrl = `${env.POKEAPI_URL}/type/${typeFilter}`;
      const response = await fetch(targetUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        next: {
          revalidate: 86400, // Cache for 24 hours
        },
      });

      if (!response.ok) {
        return NextResponse.json(
          { error: `Upstream type error: ${response.statusText}` },
          { status: response.status }
        );
      }

      const typeData = await response.json();
      const validatedType = pokeApiTypeDetailResponseSchema.parse(typeData);

      // Extract Pokemon list from the type response
      const rawResults = validatedType.pokemon.map((p) => p.pokemon);

      // If search is also provided, filter within the type!
      const filtered = search
        ? rawResults.filter((item) => item.name.toLowerCase().includes(search))
        : rawResults;

      totalCount = filtered.length;
      results = filtered.slice(offset, offset + limit);
      hasNextPage = offset + limit < totalCount;
    } else if (search) {
      // 5b. Fetch all Pokemon to perform manual server-side filtering
      const targetUrl = `${env.POKEAPI_URL}/pokemon?limit=1500`;
      const response = await fetch(targetUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        next: {
          revalidate: 86400, // Cache for 24 hours
        },
      });

      if (!response.ok) {
        return NextResponse.json(
          { error: `Upstream error: ${response.statusText}` },
          { status: response.status }
        );
      }

      const rawData = await response.json();
      const validatedRaw = pokeApiPokemonListResponseSchema.parse(rawData);

      // Perform substring filtering
      const filtered = validatedRaw.results.filter((item) =>
        item.name.toLowerCase().includes(search)
      );

      totalCount = filtered.length;
      results = filtered.slice(offset, offset + limit);
      hasNextPage = offset + limit < totalCount;
    } else {
      // 5c. Fetch normal paginated chunk from PokeAPI
      const targetUrl = `${env.POKEAPI_URL}/pokemon?limit=${limit}&offset=${offset}`;
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
        return NextResponse.json(
          { error: `Upstream error: ${response.statusText}` },
          { status: response.status }
        );
      }

      const rawData = await response.json();
      const validatedRaw = pokeApiPokemonListResponseSchema.parse(rawData);

      totalCount = validatedRaw.count;
      results = validatedRaw.results;
      hasNextPage = Boolean(validatedRaw.next);
    }

    // Strict Page-Based Offset Protection:
    // If the limit requested covers or exceeds the total available records,
    // any request with offset > 0 represents an out-of-bounds second page and should return no data.
    if (limit >= totalCount && offset > 0) {
      results = [];
      hasNextPage = false;
    }

    // 6. Transmute, normalize, and envelope client DTO format
    const transformedData = {
      success: true,
      message: 'Pokemon list retrieved successfully',
      data: {
        items: results.map((item) => {
          const id = extractIdFromUrl(item.url);
          return {
            id,
            name: item.name,
            url: item.url,
            imageUrl: getPokemonArtworkUrl(id),
          };
        }),
        pagination: {
          total: totalCount,
          limit,
          page,
          hasNextPage,
        },
      },
    };

    // Validate the transformed enveloped data with Zod
    const validatedTransformed = pokemonListResponseSchema.parse(transformedData);

    return NextResponse.json(validatedTransformed);
  } catch (error) {
    console.error('Pokemon API Route Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error in API Route' },
      { status: 500 }
    );
  }
}

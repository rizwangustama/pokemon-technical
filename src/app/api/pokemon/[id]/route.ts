import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/lib/env.server';
import { verifyRequestSignature } from '@/utils/auth';
import { getPokemonArtworkUrl } from '@/utils/index';
import {
  pokeApiPokemonDetailResponseSchema,
  pokemonDetailResponseSchema,
} from '@/schemas/pokemon.schema';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Verify request signature & timestamp freshness
    const authError = await verifyRequestSignature(request, `/pokemon/${id.toLowerCase()}`);
    if (authError) {
      return authError;
    }

    // 4. Fetch raw data from PokeAPI
    const targetUrl = `${env.POKEAPI_URL}/pokemon/${id.toLowerCase()}`;
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

    return NextResponse.json(validatedTransformed);
  } catch (error) {
    console.error('Pokemon Detail API Route Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error in API Route' },
      { status: 500 }
    );
  }
}

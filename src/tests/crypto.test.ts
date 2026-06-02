import { describe, expect, it } from 'vitest';
import { generateSignature } from '@/utils/crypto';

describe('generateSignature', () => {
  it('generates a consistent HMAC-SHA256 signature', async () => {
    const timestamp = '1700000000000';
    const path = '/pokemon/pikachu';
    const secret = 'my-secret-key';
    const message = `${timestamp}:${path}`;

    const signature1 = await generateSignature(message, secret);
    const signature2 = await generateSignature(message, secret);

    // Signature must be consistent
    expect(signature1).toBe(signature2);
    expect(signature1).toHaveLength(64); // Hex SHA-256 is exactly 64 characters
    expect(signature1).toMatch(/^[0-9a-f]{64}$/); // Must be a valid hex string
  });

  it('generates different signatures for different secrets', async () => {
    const message = '1700000000000:/pokemon';
    const sig1 = await generateSignature(message, 'secret1');
    const sig2 = await generateSignature(message, 'secret2');

    expect(sig1).not.toBe(sig2);
  });

  it('generates different signatures for different messages', async () => {
    const sig1 = await generateSignature('1700000000000:/pokemon', 'secret');
    const sig2 = await generateSignature('1700000000001:/pokemon', 'secret');

    expect(sig1).not.toBe(sig2);
  });
});

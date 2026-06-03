import { sha256 } from 'js-sha256';

/**
 * Generate a SHA-256 signature using the native Web Crypto API.
 * If Web Crypto is unavailable (e.g., in non-secure HTTP contexts in the browser),
 * it falls back to the js-sha256 library.
 */
export async function generateSignature(
  message: string,
  secret: string
): Promise<string> {
  const isWebCryptoAvailable =
    typeof crypto !== 'undefined' &&
    typeof crypto.subtle !== 'undefined';

  if (!isWebCryptoAvailable) {
    // Fallback for non-secure contexts (HTTP)
    return sha256.hmac(secret, message);
  }

  const encoder = new TextEncoder();
  const secretKeyData = encoder.encode(secret);
  const messageData = encoder.encode(message);

  // Import key for HMAC
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    secretKeyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  // Sign message
  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    cryptoKey,
    messageData
  );

  // Convert array buffer to hex string
  const signatureArray = Array.from(new Uint8Array(signatureBuffer));
  return signatureArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Generate a SHA-256 signature using the native Web Crypto API
 * which is supported natively in modern browsers and Node.js.
 */
export async function generateSignature(
  message: string,
  secret: string
): Promise<string> {
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

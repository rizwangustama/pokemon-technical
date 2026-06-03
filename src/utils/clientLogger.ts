/**
 * Sends a client-side action and detail payload to the backend terminal logger.
 * Bypasses Axios to prevent any potential request signature/logging loops.
 */
export async function logClientActivity(action: string, details?: string): Promise<void> {
  try {
    await fetch('/api/logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action, details }),
    });
  } catch (error) {
    // Silently capture client-side to keep app execution stable
    console.error('Failed to relay client log to terminal:', error);
  }
}

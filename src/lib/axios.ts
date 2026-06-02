import axios from 'axios';
import { env } from './env.client';
import { generateSignature } from '@/utils/crypto';

export const axiosInstance = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const timestamp = Date.now().toString();
    const urlPath = config.url ?? '';

    // Construct the payload to sign: "timestamp:url"
    const message = `${timestamp}:${urlPath}`;

    try {
      const signature = await generateSignature(message, env.NEXT_PUBLIC_SIGNATURE_SECRET);
      config.headers['X-Timestamp'] = timestamp;
      config.headers['X-Signature'] = signature;
    } catch (error) {
      console.error('Signature Generation Error:', error);
    }

    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Centralized error handling
    return Promise.reject(error);
  },
);

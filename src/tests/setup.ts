import '@testing-library/jest-dom';

process.env.NEXT_PUBLIC_SIGNATURE_SECRET = 'test-signature-secret-key';
process.env.POKEAPI_URL = 'https://pokeapi.co/api/v2';
process.env.PORT = '3000';
process.env.NEXT_PUBLIC_API_URL = '/api';

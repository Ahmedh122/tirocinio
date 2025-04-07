import ky from 'ky';
import ms from 'ms';

//import { unauthorizedHook } from './hooks/auth/unauthorized-hook';
import { normalizeResponseHook } from './hooks/normalize-response-hook';

const getAccessToken = () => {
  const token = localStorage.getItem('documentale.auth');
  return typeof token === 'string' ? JSON.parse(token).access_token : undefined;
};
export const prefixUrl = import.meta.env.VITE_API_BASE_URL;

const createApiClient = () =>
  ky.create({
    prefixUrl,
    hooks: {
      beforeRequest: [
        (request) => {
          const accessToken = getAccessToken();
          if (accessToken) {
            request.headers.set('Authorization', `Bearer ${accessToken}`);
          }
        },
      ],
      afterResponse: [normalizeResponseHook],
    },
    retry: 0,
    timeout: ms('90s'),
  });

export const apiClient = createApiClient();
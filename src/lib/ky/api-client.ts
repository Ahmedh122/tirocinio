import ky from "ky";
import ms from "ms";
import parseJSON from './utils/parse-json'
export const apiClient = ky.create({
  prefixUrl: import.meta.env.VITE_APP_BASE_URL,
 
  retry:0, 
  parseJson: parseJSON,
  timeout: ms('30s')
});

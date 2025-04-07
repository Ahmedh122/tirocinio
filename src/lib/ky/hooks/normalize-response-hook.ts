import fastContentTypeParse from 'fast-content-type-parse';
import type { NormalizedOptions } from 'ky';

async function parseResponse(response: Response): Promise<unknown> {
  const { type } = fastContentTypeParse.safeParse(response.headers.get('Content-Type') || '');

  switch (type) {
    case 'text/csv':
      return await response.clone().text();

    case 'application/json':
      return await response.clone().json();

    case 'application/zip':
      return await response.clone().blob();

    default:
      return null;
  }
}

export async function normalizeResponseHook(
  _request: Request,
  _options: NormalizedOptions,
  response: Response,
): Promise<Response> {
  const parsedResponse = await parseResponse(response);

  const responseInit: ResponseInit = {
    headers: new Headers(response.headers),
  };

  if (response.ok) {
    // If it is a Blob, we need to leave the content unchanged: otherwise, we invalidate it
    if (parsedResponse instanceof Blob) {
      return new Response(parsedResponse, responseInit);
    }

    return new Response(
      JSON.stringify({
        data: parsedResponse,
        status: response.status,
        error: null,
      }),
      responseInit,
    );
  }

  return new Response(
    JSON.stringify({
      data: null,
      status: response.status,
      error: parsedResponse,
    }),
    responseInit,
  );
}
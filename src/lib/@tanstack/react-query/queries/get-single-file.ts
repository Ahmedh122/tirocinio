import type { ApiFile } from '../../../../api/types/ApiFile';
import { apiClient } from '../../../ky/api-client';
import { queryOptions, UndefinedInitialDataOptions } from '@tanstack/react-query';


// Define the expected types for the response
export type GetFileSuccessResponse = ApiFile 

export type GetFileErrorResponse = unknown;



export type GetFileParams = string;


export  function makeGetFileQueryKey(id:GetFileParams) {
  return ['files', {id}] as const;
}

export async function getFiles({signal, id}:{signal?:AbortSignal, id: GetFileParams } ){
  const response = await apiClient.get(`files/${id}`, { signal }).json<GetFileSuccessResponse>();
  return response;

}




    export function getFileOptions<TSelectedResponse = GetFileSuccessResponse>(
      id: GetFileParams,
       
        options?: Omit<
          UndefinedInitialDataOptions<
            GetFileSuccessResponse,
            GetFileErrorResponse,
            TSelectedResponse,
            ReturnType<typeof makeGetFileQueryKey>
          >,
          'queryKey' | 'queryFn'
        >,
      ) {
        

        if (!id) throw new Error("Missing file ID");
        return queryOptions({
          ...options,
          queryKey: makeGetFileQueryKey(id),
          async queryFn({ signal }) {
            const response = await getFiles({
              signal,
              id: id,
            });
            console.log("optionsData", response);
            return response;
          },
        });
      }


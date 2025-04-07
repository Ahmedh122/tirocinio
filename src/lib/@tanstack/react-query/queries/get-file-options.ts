import{queryOptions, type UndefinedInitialDataOptions} from "@tanstack/react-query";

import {
    getFile, 
    type GetFileErrorResponse,
    type GetFileSuccessResponse,
} from "../../../../api/files/get-file";

export function makeGetfileQueryKey (id: string){
    return ['filetype', {id}] as const;
}

export function getFileOptions<TGetFileSelectedData = GetFileSuccessResponse>(
    id: string, 
    options?: Omit<
        UndefinedInitialDataOptions<
        GetFileSuccessResponse, 
        GetFileErrorResponse, 
        TGetFileSelectedData, 
        ReturnType<typeof makeGetfileQueryKey>>, 
        'queryKey'| 'queryFn'
    >
){
    return queryOptions(
        {
            ...options, 
            queryKey: makeGetfileQueryKey(id), 
            async queryFn({signal}){
                return await getFile(id, {
                    signal,
                });
            }
        }
    );
}
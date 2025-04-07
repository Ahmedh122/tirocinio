import{queryOptions, type UndefinedInitialDataOptions} from "@tanstack/react-query";

import {
    getFileType, 
    type GetFileTypeErrorResponse,
    type GetFileTypeSuccessResponse,
} from "../../../../api/files/get-file-type";

export function makeGetfileTypeQueryKey (id: string){
    return ['filetype', {id}] as const;
}

export function getFileTypeOptions<TGetFileTypeSelectedData = GetFileTypeSuccessResponse>(
    id: string, 
    options?: Omit<
        UndefinedInitialDataOptions<
        GetFileTypeSuccessResponse, 
        GetFileTypeErrorResponse, 
        TGetFileTypeSelectedData, 
        ReturnType<typeof makeGetfileTypeQueryKey>>, 
        'queryKey'| 'queryFn'
    >
){
    return queryOptions(
        {
            ...options, 
            queryKey: makeGetfileTypeQueryKey(id), 
            async queryFn({signal}){
                return await getFileType(id, {
                    signal,
                });
            }
        }
    );
}
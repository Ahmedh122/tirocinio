import type {ApiFile} from '../../../../api/types/ApiFile';
import {apiClient} from '../../../ky/api-client';
import { queryOptions, type UseQueryOptions } from '@tanstack/react-query';


export type GetFilesSuccessResponse = {
    content: ApiFile[];
    totalPages: number;
    totalItems: number;
}


export type GetFileErrorResponse = unknown;

export type GetFilesResponse =  GetFilesSuccessResponse|GetFileErrorResponse ;

export function makeGetFilesQueryKey(){
    return['files'] as const;
}

export function getFilesQuery(options?: Omit<UseQueryOptions<GetFilesResponse>, 'queryKey' | 'queryFn'>){
    return queryOptions(
        {
            ...options,
            queryKey:makeGetFilesQueryKey(),
            async queryFn({signal}){
                const response= await apiClient.get(`files`, {
                    signal, 
                }).json<GetFilesResponse>();

                return response;
            }
        }
    )
};
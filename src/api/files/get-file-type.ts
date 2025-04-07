import type {Options} from 'ky';
import {apiClient} from '../../lib/ky/api-client';
import type {ApiResponse, ApiErrorResponse} from '../../types/api-response'
import type {FileType} from '../types/file-type';


export type GetFileTypeSuccessResponse = FileType;
export type GetFileTypeErrorResponse = unknown;
export type GetFileTypeResponse = ApiResponse<GetFileTypeSuccessResponse, GetFileTypeErrorResponse>;

export async function getFileType(id:string, options?: Options) {
    const response = await apiClient.get(`file_types/${id}`, options).json<GetFileTypeResponse>();
    if ((response as ApiErrorResponse<GetFileTypeErrorResponse>).error){
        throw response;
    };
   
   return response.data as GetFileTypeSuccessResponse;
    
}
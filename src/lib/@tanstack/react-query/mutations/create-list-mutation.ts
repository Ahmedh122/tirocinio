import {z} from 'zod';
import { apiClient } from '../../../ky/api-client'
import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import { List } from '../../../../api/types/List';



export type CreateListSchema = z.infer<ReturnType<typeof createListSchema>>

export function createListSchema() {
  return z.object({
    name: z.string().min(4, 'required').max(128, 'too long'),
    fileIds: z.array(z.string())
  })
}

export type ReturnListType={
    name: string,
    fileIds: string[  ],
    _id: string,
    createdAt: string,
    updatedAt: string,
    __v: number
}

export interface ApiError {
    message: string;
    code: string;  
    details?: string;  
  }

export type ApiErrorResponse = ApiError;

export function useCreateList( options?: Omit<
    UseMutationOptions<List, ApiErrorResponse, CreateListSchema>,
    'mutationKey' | 'mutationFn' | 'onSuccess'
  >) {
    const queryClient = useQueryClient()
    const snackbar = useSnackbar()
  
    return useMutation({
      ...options,
      mutationKey: ['createList'],
  
      async mutationFn(data: CreateListSchema) {
        const response = await apiClient
          .post('lists', {
            json: {
              name: data.name,
              fileIds: data.fileIds,
            },
          })
          .json<ReturnListType>() 
  
        return response
      },
  
      onSuccess() {
        snackbar.enqueueSnackbar({
          variant: 'success',
          message: 'List created successfully!',
        })
  
        queryClient.invalidateQueries({ queryKey: ['getLists'] }) 
      },
  
      async onError(error: ApiErrorResponse) {
        let errorMessage = 'An unknown error occurred';
  
        
        if (error.code === 'E11000') {
          errorMessage = 'A list with this name already exists. Please choose a different name.';
        } else if (error.message) {
          errorMessage = error.message;
        }
  
        snackbar.enqueueSnackbar({
          variant: 'error',
          message: errorMessage,
        });
      },
    })
  }
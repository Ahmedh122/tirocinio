import { z } from "zod";
import { apiClient } from "../../../ky/api-client";
import {
  useMutation,

  UseMutationOptions,
} from "@tanstack/react-query";
import { useSnackbar } from "notistack";


export type RemoveFileFromListSchema = z.infer<ReturnType<typeof removeFileFromListSchema>>;

export function removeFileFromListSchema() {
  return z.object({
    fileIds: z.array(z.string()),
  });
}

export type ReturnListType = {
  name: string;
  fileIds: string[];
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export interface ApiError {
  message: string;
  code: string;
  details?: string;
}

export type ApiErrorResponse = ApiError;

export  function makeDelFileListQueryKey(id:string) {
  return ['modlist', {id}] as const;
}

export function useDeleteFileList(
    id: string,
  options?: Omit<
    UseMutationOptions<ReturnListType, ApiErrorResponse, RemoveFileFromListSchema>,
    "mutationKey" | "mutationFn" 
  >
) {
  
  const snackbar = useSnackbar();

  return useMutation({
    ...options,
    mutationKey: makeDelFileListQueryKey(id) ,

    async mutationFn(data: RemoveFileFromListSchema) {
      try {
        const response = await apiClient
          .put(`lists/removeFiles/${id}`, {
            json: {
              fileIds: data.fileIds,
            },
          })
          .json<ReturnListType>();
    
        return response;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        if (err.response) {
          const errorBody = await err.response.json(); 
          throw errorBody; 
        }
        throw err;
      }
    },

    onSuccess(data, variables, context) {
      snackbar.enqueueSnackbar({
        variant: "success",
        message: "file removed from list successfully!",
      });


      options?.onSuccess?.(data, variables, context);
    },

   
   

     
    
  });
}
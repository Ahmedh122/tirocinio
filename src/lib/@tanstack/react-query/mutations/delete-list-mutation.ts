import { apiClient } from "../../../ky/api-client";
import {
  useMutation,

  UseMutationOptions,
} from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { queryClient } from "../query-client";




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

export  function makeDeleteListQueryKey(id:string) {
  return ['modlist', {id}] as const;
}

export function useDeleteList(
    id: string,
  options?: Omit<
    UseMutationOptions<ReturnListType, ApiErrorResponse, void>,
    "mutationKey" | "mutationFn" 
  >
) {
  
  const snackbar = useSnackbar();

  return useMutation({
    ...options,
    mutationKey: makeDeleteListQueryKey(id) ,

    async mutationFn() {
      try {
        const response = await apiClient
          .delete(`lists/${id}`, {
           
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
        message: "list removed successfully!",
      });

      queryClient.invalidateQueries({queryKey: ["lists"]});
      options?.onSuccess?.(data, variables, context);
    },

   
   

     
    
  });
}
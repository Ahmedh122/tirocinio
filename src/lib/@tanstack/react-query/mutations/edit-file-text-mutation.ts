import { apiClient } from "../../../ky/api-client";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useSnackbar } from "notistack";



export type ReturnFileType = unknown;

export interface ApiError {
  message: string;
  code: string;
  details?: string;
}

export type ApiErrorResponse = ApiError;

// Key generator for query invalidation
export function makeModFileQueryKey(id: string) {
  return ["modlist", { id }] as const;
}

export function useModifyFileText(
  id: string, 
) {
  const queryClient = useQueryClient();
  const snackbar = useSnackbar();

  return useMutation<unknown, ApiErrorResponse, Record<string,unknown>>({
   
    mutationKey: makeModFileQueryKey(id),
    mutationFn: async (data) => {
      try {
        const response = await apiClient
          .put(`files/text/${id}`, {
            json: {
             edited: data
            },
          })
          .json<ReturnFileType>();

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files", { id }] });
     
    },
    onError(error: { message?: string; error?: string }) {
       
        const errorMessage = typeof error?.message === 'string' ? error.message : '';
        const errorDetail = typeof error?.error === 'string' ? error.error : '';
        const displayMessage = errorMessage || errorDetail || 'Si è verificato un errore';
  
        snackbar.enqueueSnackbar({
          variant: 'error',
          message: displayMessage,
        });
      },
  });
}

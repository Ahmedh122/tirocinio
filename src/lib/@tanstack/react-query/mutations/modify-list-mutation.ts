import { z } from "zod";
import { apiClient } from "../../../ky/api-client";
import {
  useMutation,
  useQueryClient,
  UseMutationOptions,
} from "@tanstack/react-query";
import { useSnackbar } from "notistack";


export type ModifyListSchema = z.infer<ReturnType<typeof modifyListSchema>>;

export function modifyListSchema() {
  return z.object({
    name: z.string().min(4, "required").max(128, "too long").optional(),
    fileIds: z.array(z.string()).optional(),
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

export  function makeModListQueryKey(id:string) {
  return ['modlist', {id}] as const;
}

export function useModifyList(
    id: string,
  options?: Omit<
    UseMutationOptions<ModifyListSchema, ApiErrorResponse, ModifyListSchema>,
    "mutationKey" | "mutationFn" 
  >
) {
  const queryClient = useQueryClient();
  const snackbar = useSnackbar();

  return useMutation({
    ...options,
    mutationKey: makeModListQueryKey(id) ,

    async mutationFn(data: ModifyListSchema) {
      try {
        const response = await apiClient
          .put(`lists/${id}`, {
            json: {
              name: data.name,
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
        message: "List modified successfully!",
      });

      queryClient.invalidateQueries({ queryKey: ["list", {id}] });
      queryClient.invalidateQueries({queryKey: ["lists"]});
      options?.onSuccess?.(data, variables, context);
    },

   
   

     
    
  });
}
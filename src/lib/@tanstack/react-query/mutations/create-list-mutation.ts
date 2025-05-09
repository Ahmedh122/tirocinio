import { z } from "zod";
import { apiClient } from "../../../ky/api-client";
import {
  useMutation,
  useQueryClient,
  UseMutationOptions,
} from "@tanstack/react-query";
import { useSnackbar } from "notistack";

import { ModifyListSchema } from "./modify-list-mutation";

export type CreateListSchema = z.infer<ReturnType<typeof createListSchema>>;

export function createListSchema() {
  return z.object({
    name: z.string().min(4, "required").max(128, "too long"),
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

export function useCreateList(
  options?: Omit<
    UseMutationOptions<ModifyListSchema, ApiErrorResponse, CreateListSchema>,
    "mutationKey" | "mutationFn" 
  >
) {
  const queryClient = useQueryClient();
  const snackbar = useSnackbar();

  return useMutation({
    ...options,
    mutationKey: ["createList"],

    async mutationFn(data: CreateListSchema) {
      try {
        const response = await apiClient
          .post("lists", {
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

    //prova

    onSuccess(data, variables, context) {
      snackbar.enqueueSnackbar({
        variant: "success",
        message: "List created successfully!",
      });

      queryClient.invalidateQueries({ queryKey: ["lists"] });
      options?.onSuccess?.(data, variables, context);
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError(error: any) {
      let errorMessage = "An unknown error occurred";
    
      console.error("Error response:", error);
    
      if (typeof error?.error === "string" && error.error.includes("E11000")) {
        errorMessage =
          "A list with this name already exists. Please choose a different name.";
      } else if (typeof error?.message === "string") {
        errorMessage = error.message;
      }
    
      snackbar.enqueueSnackbar({
        variant: "error",
        message: errorMessage,
      });
    }

     
    
  });
}

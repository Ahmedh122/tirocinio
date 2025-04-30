import { z } from "zod";
import { apiClient } from "../../../ky/api-client";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { queryClient } from "../query-client";
import { useSnackbar } from "notistack";
import { GetListParams } from "../queries/get-single-list";

export type ActionSchema = z.infer<ReturnType<typeof actionSchema>>;

export function actionSchema() {
  return z.object({
    listIds: z.array(z.string()),
    fileIds: z.array(z.string()),
  });
}

export type ReturnActionType = {
  success: boolean;
};

export interface ApiError {
  message: string;
  code: string;
  details?: string;
}

export type ApiErrorResponse = ApiError;

export function makeActionKey(id: string) {
  return ["action", { id }] as const;
}

export function useAction(
  id: string,
  params: GetListParams,
  options?: Omit<
    UseMutationOptions<ReturnActionType, ApiErrorResponse, ActionSchema>,
    "mutationKey" | "mutationFn"
  >
) {
  const snackbar = useSnackbar();
  return useMutation({
    ...options,
    mutationKey: makeActionKey(id),

    async mutationFn(data: ActionSchema) {
      try {
        const response = await apiClient
          .post(`actions/${id}`, {
            json: {
              listIds: data.listIds,
              fileIds: data.fileIds,
            },
          })
          .json<ReturnActionType>();

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
        if(id==="remove_from_list"){ snackbar.enqueueSnackbar({
        variant: "success",
        message: "file removed from list successfully!",
      });}
     
      queryClient.invalidateQueries({
        queryKey: ["list", { params }],
      });
      queryClient.invalidateQueries({ queryKey: ["lists"] });
      options?.onSuccess?.(data, variables, context);
    },
  });
}

import {
  queryOptions,
  UndefinedInitialDataOptions,
} from "@tanstack/react-query";
import { apiClient } from "../../../ky/api-client";
import { Action } from "../../../../api/types/Actions";

export type GetActionSuccessResponse = Action[];

export type GetActionErrorResponse = unknown;

export function makeGetActionQuerykey() {
  return ["actions"] as const;
}

export async function getActions({ signal }: { signal?: AbortSignal }) {
  const url = "actions";
  const response = await apiClient
    .get(url, { signal })
    .json<GetActionSuccessResponse>();
  return response;
}

export function getActionsOptions<TSelectedResponse = GetActionSuccessResponse>(
  options?: Omit<
    UndefinedInitialDataOptions<
      GetActionSuccessResponse,
      GetActionErrorResponse,
      TSelectedResponse,
      ReturnType<typeof makeGetActionQuerykey>
    >,
    "queryKey" | "queryFn"
  >
) {
  return queryOptions({
    ...options,
    queryKey: makeGetActionQuerykey(),
    async queryFn({ signal }) {
      const response = await getActions({ signal });
      return response;
    },
  });

  
}

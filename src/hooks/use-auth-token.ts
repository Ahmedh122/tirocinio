import { useQueryClient } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import type { Dispatch, SetStateAction } from "react";
import { useLocalStorage } from "usehooks-ts";
import type { AuthToken, DecodedAuthToken } from "../api/types/auth-token";

export const authTokenLocalStorageKey = "training.auth";

export function useAuthToken(): [
  DecodedAuthToken | null,
  Dispatch<SetStateAction<AuthToken>>,
  () => void
] {
  const queryClient = useQueryClient()

  const [authToken, setAuthToken, _deleteAuthToken] = useLocalStorage<
    AuthToken | DecodedAuthToken | null
  >(authTokenLocalStorageKey, null , {
    deserializer:(value:string)=> {
        return jwtDecode(value)
    },
    initializeWithValue:true,
  })

  const deleteAuthToken = () =>{
    queryClient.clear()
    _deleteAuthToken()

    return [
      authToken as DecodedAuthToken | null,
      setAuthToken as Dispatch<SetStateAction<AuthToken>>,
      deleteAuthToken,
    ];
  }
}

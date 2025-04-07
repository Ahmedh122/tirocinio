import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
    defaultOptions:{
        queries: {
            staleTime:0,
            refetchInterval:false,
            refetchIntervalInBackground:false,
            refetchOnWindowFocus:false,
            refetchOnReconnect:false,
            refetchOnMount:false,
            gcTime:0,
        },
    },
});
import {
  useMutation,
  useQuery,
  useQueryClient,
  QueryClient,
} from "react-query";

import { instance } from "@/lib/axios";

import type { AxiosError, AxiosResponse } from "axios";
import type { UseQueryOptions, DefaultOptions } from "react-query";
import type { QueryFunctionContext } from "react-query/types/core/types";

type QueryKeyT = [string, object | undefined];

const queryConfig: DefaultOptions = {
  queries: {
    useErrorBoundary: true,
    refetchOnWindowFocus: false,
    retry: 2,
  },
};
// TODO: sometimes config doesn't work
export const queryClient = new QueryClient({ defaultOptions: queryConfig });

export const fetcher = async <T>({
  queryKey,
  pageParam,
}: QueryFunctionContext<QueryKeyT>): Promise<T> => {
  const [url, params] = queryKey;

  const res = await instance.get<T>(url, { params: { ...params, pageParam } });
  return res.data;
};

export const usePrefetch = <T>(url: string | null, params?: object) => {
  const queryClient = useQueryClient();

  return () => {
    if (!url) {
      return;
    }

    queryClient.prefetchQuery<T, Error, T, QueryKeyT>(
      [url!, params],
      ({ queryKey }) => fetcher({ queryKey, meta: {} })
    );
  };
};

export const useFetch = <T>(
  url: string | null,
  params?: object,
  config?: UseQueryOptions<T, Error, T, QueryKeyT>
) => {
  const context = useQuery<T, Error, T, QueryKeyT>(
    [url!, params],
    ({ queryKey }) => fetcher({ queryKey, meta: {} }),
    {
      enabled: !!url,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 30,
      ...config,
    }
  );

  return context;
};

const useGenericMutation = <T, S>(
  func: (data: T | S) => Promise<AxiosResponse<S>>,
  url: string,
  params?: object,
  updater?: ((oldData: T, newData: S) => T) | undefined
) => {
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse, AxiosError, T | S>(func, {
    onMutate: async (data) => {
      await queryClient.cancelQueries([url!, params]);

      const previousData = queryClient.getQueryData([url!, params]);

      queryClient.setQueryData<T>([url!, params], (oldData) => {
        return updater ? updater(oldData!, data as S) : (data as T);
      });

      return previousData;
    },
    onError: (_err, _, context) => {
      queryClient.setQueryData([url!, params], context);
    },
    onSettled: () => {
      queryClient.invalidateQueries([url!, params]);
    },
  });
};

export const useDelete = <T>(
  url: string,
  params?: object,
  updater?: (oldData: T, id: string | number) => T
) => {
  return useGenericMutation<T, string | number>(
    (id) => instance.delete(`${url}/${id}`),
    url,
    params,
    updater
  );
};

export const usePost = <T, S>(
  url: string,
  params?: object,
  updater?: (oldData: T, newData: S) => T
) => {
  return useGenericMutation<T, S>(
    (data) => instance.post<S>(url, data),
    url,
    params,
    updater
  );
};

export const useUpdate = <T, S>(
  url: string,
  params?: object,
  updater?: (oldData: T, newData: S) => T
) => {
  return useGenericMutation<T, S>(
    (data) => instance.patch<S>(url, data),
    url,
    params,
    updater
  );
};

interface CachedFetchOptions<T = any> {
    fetchOptions?: Parameters<typeof $fetch>[1];
    refresh?: boolean;
    promise?: boolean;
    action?: {
        server?: boolean;
        lazy?: boolean;
        immediate?: boolean;
    };
}

const clientPromiseCache = new Map<string, Promise<any>>();
const clientDataCache = new Map<string, any>();

export function useCachedFetch<T>(
    key: string,
    url: string,
    options: CachedFetchOptions<T> = {}
) {
    const {
        fetchOptions = {},
        refresh = false,
        promise = false,
        action = {
            server: true,
            lazy: false,
            immediate: true,
        },
    } = options;

    // 服务端和客户端共享state
    const state = useState<T | null>(`State-${key}`, () => null);
    const errorState = useState<any>(`Err-${key}`, () => null);

    const refreshClient = () => {
        state.value = null;
        errorState.value = null;
        clientDataCache.delete(key);
        clientPromiseCache.delete(key);
    };

    // 服务端只会等useAsyncData，不会等promise
    if (import.meta.server) {
        return useAsyncData<T>(
            `Async-${key}`,
            async () => {
                // try {
                    if (!refresh && state.value) return state.value;
                    const data = await $fetch<T>(url, fetchOptions);
                    if (!data || data?.type == "404") {
                        throw createError({
                            statusCode: 404,
                            statusMessage: "Not found",
                        });
                    }
                    state.value = data;
                    return data;
                // } catch (err) {
                //     throw err;
                // }
            },
            action
        );
    }

    if (!refresh) {
        // 有状态缓存
        if (state.value && !errorState.value) {
            clientDataCache.set(key, state.value);
            return {
                data: state,
                pending: computed(() => false),
                error: errorState,
                refresh: refreshClient,
            };
        }

        // 有客户端数据缓存
        if (clientDataCache.has(key)) {
            state.value = clientDataCache.get(key);
            return {
                data: state,
                pending: computed(() => false),
                error: errorState,
                refresh: refreshClient,
            };
        }

        // 有 promise 正在进行
        if (clientPromiseCache.has(key)) {
            const p = clientPromiseCache.get(key)!;

            p.then((res) => {
                state.value = res;
                clientDataCache.set(key, res);
            }).catch((err) => {
                errorState.value = err;
                clientPromiseCache.delete(key);
            });

            return {
                data: state,
                pending: computed(() => !state.value && !errorState.value),
                error: errorState,
                refresh: refreshClient,
                ...(promise ? { promise: p } : {}),
            };
        }
    }

    const p = $fetch<T>(url, fetchOptions)
        .then((res) => {
            state.value = res;
            clientDataCache.set(key, res);
            clientPromiseCache.delete(key);
            return res;
        })
        .catch((err) => {
            errorState.value = err;
            clientPromiseCache.delete(key);
            throw err;
        });

    clientPromiseCache.set(key, p);

    return {
        data: state,
        pending: computed(() => !state.value && !errorState.value),
        error: errorState,
        refresh: refreshClient,
        ...(promise ? { promise: p } : {}),
    };
}

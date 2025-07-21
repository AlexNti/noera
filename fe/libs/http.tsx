const API_BASE_URL = "https://eth-sepolia.g.alchemy.com";
const API_VERSION = "v2";

export type ApiResponse<T> = {
  data: T;
  status: number;
  ok: boolean;
  error: null;
};

export type ApiErrorResponse = {
  data: null;
  status: number;
  ok: boolean;
  error: { message: string; stack?: string };
};

export type ApiSuccessOrError<T> = ApiResponse<T> | ApiErrorResponse;

type CacheOptions = "force-cache" | "no-store";

type NextOptions = { tags?: string[]; revalidate?: number };

type RequestConfig = {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
  cache?: CacheOptions;
  next?: NextOptions;
};

export function buildUrl(
  endpoint: string,
  params?: Record<string, string | number | boolean>
): string {
  const fullUrl = `${API_BASE_URL}/${API_VERSION}${endpoint}`;
  const url = new URL(fullUrl);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url.toString();
}

async function apiRequest<T>(
  url: string,
  requestConfig?: RequestConfig
): Promise<ApiSuccessOrError<T>> {
  const { cache, ...fetchConfig } = requestConfig || {};

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
    ...fetchConfig,

    ...(typeof cache === "string" && { cache }),
  } as const;

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      return {
        data: null,
        status: response.status,
        ok: response.ok,
        error: {
          message: data.message || "Request failed",
          code: data.code || 0,
        },
      };
    }

    return {
      data,
      status: response.status,
      ok: response.ok,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      status: 500,
      ok: false,
      error: {
        message: error instanceof Error ? error.message : "Unknown error",
        code: 500,
        stack: error instanceof Error ? error.stack : undefined,
      },
    };
  }
}

export const http = Object.freeze({
  async post<T, D = unknown>(
    url: string,
    data: D,
    { cache, next }: { cache?: CacheOptions; next?: NextOptions } = {}
  ): Promise<ApiSuccessOrError<T>> {
    return apiRequest<T>(url, {
      method: "POST",
      body: JSON.stringify(data),
      cache,
      next,
    });
  },
});

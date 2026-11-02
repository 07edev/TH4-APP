import {API_BASE_URL, REQUEST_TIMEOUT} from '../config';

export type ApiError = {
  type: 'network' | 'timeout' | 'http';
  status?: number;
  message: string;
};

export async function request<T>(
  method: string,
  url: string,
  body?: unknown,
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method,
      headers: {'Content-Type': 'application/json'},
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });
    const content = await response.text();
    const data = content ? JSON.parse(content) : null;
    if (!response.ok) {
      throw {type: 'http', status: response.status, message: 'Máy chủ trả về lỗi.'} satisfies ApiError;
    }
    return data as T;
  } catch (error) {
    if ((error as ApiError).type === 'http') throw error;
    if ((error as {name?: string}).name === 'AbortError') {
      throw {type: 'timeout', message: 'Kết nối máy chủ quá thời gian.'} satisfies ApiError;
    }
    throw {type: 'network', message: 'Không thể kết nối đến máy chủ.'} satisfies ApiError;
  } finally {
    clearTimeout(timer);
  }
}

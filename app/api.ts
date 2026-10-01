export async function api<T>(
  path: string,
  method = "GET",
  body?: unknown,
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(`/api${path}`, {
      method,
      credentials: "same-origin",
      cache: "no-store",
      signal: controller.signal,
      headers:
        method === "GET"
          ? {}
          : { "Content-Type": "application/json", "X-FindMyID": "1" },
      body: method === "GET" ? undefined : JSON.stringify(body ?? {}),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => null);
      throw new Error(
        data?.message ||
          (response.status === 401
            ? "Please log in to continue."
            : response.status === 403
              ? "You do not have permission for this action."
              : "Unable to complete the request. Please try again."),
      );
    }
    return response.status === 204 ? (undefined as T) : await response.json();
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError")
      throw new Error("The request timed out. Please try again.");
    if (error instanceof TypeError)
      throw new Error(
        "Cannot reach the server. Check your connection and try again.",
      );
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

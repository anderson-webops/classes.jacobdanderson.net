const defaultMaxAttempts = 3;
const defaultRetryDelayMs = 250;
const defaultTimeoutMs = 5_000;

function wait(milliseconds) {
	return new Promise(resolve => setTimeout(resolve, milliseconds));
}

export function isRetryableStaticMediaStatus(status) {
	return status === 429 || (status >= 500 && status <= 599);
}

export async function fetchStaticMediaWithRetry(
	url,
	{
		fetchImplementation = globalThis.fetch,
		maxAttempts = defaultMaxAttempts,
		retryDelayMs = defaultRetryDelayMs,
		timeoutMs = defaultTimeoutMs,
		waitImplementation = wait
	} = {}
) {
	let result = { attempts: 0, error: "", ok: false, status: 0 };

	for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
		try {
			let response = await fetchImplementation(url, {
				method: "HEAD",
				signal: AbortSignal.timeout(timeoutMs)
			});
			if (response.status === 403 || response.status === 405) {
				response = await fetchImplementation(url, {
					headers: { Range: "bytes=0-0" },
					method: "GET",
					signal: AbortSignal.timeout(timeoutMs)
				});
			}

			result = {
				attempts: attempt,
				error: "",
				ok: response.ok || response.status === 206,
				status: response.status
			};
		} catch (error) {
			result = {
				attempts: attempt,
				error: error instanceof Error ? error.message : String(error),
				ok: false,
				status: 0
			};
		}

		if (
			result.ok
			|| (result.status !== 0 && !isRetryableStaticMediaStatus(result.status))
			|| attempt === maxAttempts
		) {
			return result;
		}

		await waitImplementation(retryDelayMs * attempt);
	}

	return result;
}

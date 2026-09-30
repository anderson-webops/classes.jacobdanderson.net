export const api = new Proxy(
	{},
	{
		get() {
			throw new Error(
				"Account APIs are unavailable in the Python runtime."
			);
		}
	}
);

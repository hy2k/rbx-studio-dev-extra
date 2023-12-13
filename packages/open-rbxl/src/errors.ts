export class OpenRbxlError extends Error {
	constructor(string?: string, options?: ErrorOptions) {
		super(string, options);
		this.name = 'OpenRbxlError';
	}
}

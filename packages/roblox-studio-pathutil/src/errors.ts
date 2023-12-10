export class PlatformNotSupportedError extends Error {
	constructor(string?: string, options?: ErrorOptions) {
		super(string, options);
		this.name = 'PlatformNotSupportedError';
	}
}

export class StudioNotFoundError extends Error {
	constructor(string?: string, options?: ErrorOptions) {
		super(string, options);
		this.name = 'StudioNotFoundError';
	}
}

export class InvalidStudioRootError extends Error {
	constructor(string?: string, options?: ErrorOptions) {
		super(string, options);
		this.name = 'InvalidStudioRootError';
	}
}

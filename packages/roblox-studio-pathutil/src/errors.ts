export class RbxStudioPathError extends Error {
	constructor(string?: string, options?: ErrorOptions) {
		super(string, options);
		this.name = 'RbxStudioPathError';
	}
}

export class PlatformNotSupportedError extends RbxStudioPathError {
	constructor(string?: string, options?: ErrorOptions) {
		super(string, options);
		this.name = 'PlatformNotSupportedError';
	}
}

export class StudioNotInstalledError extends RbxStudioPathError {
	constructor(string?: string, options?: ErrorOptions) {
		super(string, options);
		this.name = 'StudioNotInstalledError';
	}
}

export class InvalidStudioRootError extends RbxStudioPathError {
	constructor(string?: string, options?: ErrorOptions) {
		super(string, options);
		this.name = 'InvalidStudioRootError';
	}
}

import { describe, expect, it } from 'vitest';

import {
	InvalidStudioRootError,
	PlatformNotSupportedError,
	RbxStudioPathError,
	StudioNotInstalledError,
} from './errors.js';

describe('RbxStudioPathError', () => {
	it('should be an instance of Error', () => {
		const error = new RbxStudioPathError();
		expect(error.name).toBe(RbxStudioPathError.name);
		expect(error instanceof Error).toBe(true);
	});
});

describe('PlatformNotSupportedError', () => {
	it('should be an instance of StudioPathError', () => {
		const error = new PlatformNotSupportedError();
		expect(error.name).toBe(PlatformNotSupportedError.name);
		expect(error instanceof RbxStudioPathError).toBe(true);
	});
});

describe('InvalidStudioRootError', () => {
	it('should be an instance of StudioPathError', () => {
		const error = new InvalidStudioRootError();
		expect(error.name).toBe(InvalidStudioRootError.name);
		expect(error instanceof RbxStudioPathError).toBe(true);
	});
});

describe('StudioNotInstalledError', () => {
	it('should be an instance of StudioPathError', () => {
		const error = new StudioNotInstalledError();
		expect(error.name).toBe(StudioNotInstalledError.name);
		expect(error instanceof RbxStudioPathError).toBe(true);
	});
});

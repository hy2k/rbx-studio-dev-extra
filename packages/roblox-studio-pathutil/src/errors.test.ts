import assert from 'node:assert';
import test from 'node:test';

import {
	InvalidStudioRootError,
	PlatformNotSupportedError,
	RbxStudioPathError,
	StudioNotInstalledError,
} from './errors.js';

test('StudioPathError should be an instance of Error', () => {
	const error = new RbxStudioPathError();
	assert.strictEqual(error.name, RbxStudioPathError.name);
	assert.strictEqual(error instanceof Error, true);
});

test('PlatformNotSupportedError should be an instance of StudioPathError', () => {
	const error = new PlatformNotSupportedError();
	assert.strictEqual(error.name, PlatformNotSupportedError.name);
	assert.strictEqual(error instanceof RbxStudioPathError, true);
});

test('InvalidStudioRootError should be an instance of StudioPathError', () => {
	const error = new InvalidStudioRootError();
	assert.strictEqual(error.name, InvalidStudioRootError.name);
	assert.strictEqual(error instanceof RbxStudioPathError, true);
});

test('StudioNotFoundError should be an instance of StudioPathError', () => {
	const error = new StudioNotInstalledError();
	assert.strictEqual(error.name, StudioNotInstalledError.name);
	assert.strictEqual(error instanceof RbxStudioPathError, true);
});

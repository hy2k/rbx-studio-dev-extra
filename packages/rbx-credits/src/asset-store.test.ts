import { describe, expect, it } from '@jest/globals';

import type { DeveloperProductInfo } from './schema';

import { AssetStore } from './asset-store';

const asset: Readonly<DeveloperProductInfo> = {
	AssetId: 1,
	Created: 'test',
	Creator: {
		Id: 1,
		Name: 'test',
	},
	Name: 'test',
	Updated: 'test',
};

describe.only('AssetStore', () => {
	it('should add asset to group when the data does not previously have the group', () => {
		const assetStore = new AssetStore();
		const group = 'testGroup';

		assetStore.add(group, asset);

		const assets = assetStore.getByProperty(group);
		expect(assets).toBeDefined();
		expect(assets).toHaveLength(1);
		expect(assets![0]).toBe(asset);
	});

	it('should not add duplicate asset to the same group', () => {
		const assetStore = new AssetStore();
		const group = 'testGroup';

		assetStore.add(group, asset);
		assetStore.add(group, asset);

		const assets = assetStore.getByProperty(group);
		expect(assets).toBeDefined();
		expect(assets).toHaveLength(1);
		expect(assets![0]).toBe(asset);
	});

	it('should get assets by property', () => {
		const assetStore = new AssetStore();
		const group = 'testGroup';

		assetStore.add(group, asset);

		const assets = assetStore.getByProperty(group);
		expect(assets).toBeDefined();
		expect(assets).toHaveLength(1);
		expect(assets[0]).toBe(asset);
	});

	it('should return an empty array if no assets exist for the property', () => {
		const assetStore = new AssetStore();
		const group = 'nonexistentGroup';

		const assets = assetStore.getByProperty(group);
		expect(assets).toBeDefined();
		expect(assets).toHaveLength(0);
	});
});

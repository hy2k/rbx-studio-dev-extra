import {
	Lighting,
	ReplicatedFirst,
	ReplicatedStorage,
	ServerScriptService,
	ServerStorage,
	SoundService,
	StarterGui,
	StarterPack,
	StarterPlayer,
	Workspace,
} from '@rbxts/services';

import type { RawAssetValue } from './properties';

import { getAssetProperties } from './properties';

// https://create.roblox.com/docs/scripting/services
const CONTAINERS = [
	// Workspace
	Workspace,

	// Environment
	Lighting,
	SoundService,

	// Replication
	ReplicatedStorage,
	ReplicatedFirst,

	// Server
	ServerStorage,
	ServerScriptService,

	// Client
	StarterGui,
	StarterPack,
	StarterPlayer,
];

function getInstanceAssets(instance: Instance): Map<string, RawAssetValue[]> {
	const assets = new Map<string, RawAssetValue[]>();

	const props = getAssetProperties(instance);

	for (const [key, id] of pairs(props)) {
		const category = assets.get(tostring(key)) ?? [];
		if (category.size() === 0) {
			assets.set(tostring(key), category);
		}
		category.push(id);
	}

	return assets;
}

export function findAssets(): Map<string, RawAssetValue[]> {
	const assets = new Map<string, RawAssetValue[]>();

	for (const container of CONTAINERS) {
		for (const instance of container.GetDescendants()) {
			const instanceAssets = getInstanceAssets(instance);

			for (const [key, ids] of pairs(instanceAssets)) {
				const category = assets.get(tostring(key)) ?? [];

				if (category.size() === 0 && ids.size()) {
					assets.set(tostring(key), category);
				}

				for (const id of ids) {
					category.push(id);
				}
			}
		}
	}

	return assets;
}

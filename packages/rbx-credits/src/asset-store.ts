import type { DeveloperProductInfo } from './schema.js';

export class AssetStore {
	#data = new Map<string, DeveloperProductInfo[]>();

	add(rbxProperty: string, asset: DeveloperProductInfo): void {
		const assets = this.getByProperty(rbxProperty);

		if (assets.some((a) => a.AssetId === asset.AssetId)) {
			return;
		}

		assets.push(asset);
		this.#data.set(rbxProperty, assets);
	}

	formatData(): string {
		let formatted = '';

		for (const [property, assets] of this.#data) {
			formatted += `**${property}**\n`;

			for (const asset of assets) {
				formatted += `${asset.AssetId} by ${asset.Creator.Name}\n`;
			}
		}

		return formatted;
	}

	getByProperty(rbxProperty: string): DeveloperProductInfo[] {
		return this.#data.get(rbxProperty) ?? [];
	}
}

import { ServerStorage } from '@rbxts/services';

const CONTAINER_ID = 'PluginConfig';
const PLUGIN_ID = 'rbx-credits';

// NOTE: Plugin configuration must be created in the game's place. Although it's probably better to
// re-use CLI flags for config like Port number, but unlike `run-in-roblox` which can create a
// plugin at runtime, this plugin is pre-built so it's not possible without manipulating the RBXM or
// RBXML file. It may be possbile to use a tool like Lune to create Configuration instance within
// the model at runtime, but I decided not to do that for now.

const userConfig =
	ServerStorage.FindFirstChild(PLUGIN_ID) ?? ServerStorage.FindFirstChild(CONTAINER_ID)?.FindFirstChild(PLUGIN_ID);

interface Config {
	readonly debugMode: boolean;
	readonly pollInterval: number;
	readonly port: number;
}

const defaultConfig: Config = {
	debugMode: false,
	pollInterval: 5,
	port: 11499,
};

function getConfig(): Config {
	const config = { ...defaultConfig };

	if (userConfig?.IsA('Configuration')) {
		for (const [key, value] of userConfig.GetAttributes()) {
			if (key === 'debugMode' && typeIs(value, 'boolean')) {
				config.debugMode = value;
			}

			if (key === 'pollInterval') {
				const pollInterval = tonumber(value);
				if (pollInterval !== undefined) {
					config.pollInterval = pollInterval;
				}
			}

			if (string.lower(key) === 'port') {
				const port = tonumber(value);
				if (port !== undefined) {
					config.port = port;
				}
			}
		}
	}

	table.freeze(config);
	return config;
}

export const config = getConfig();

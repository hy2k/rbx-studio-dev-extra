# roblox-studio-pathutil

## Install

```bash
npm install roblox-studio-pathutil
```

## Usage

ESM only

```js
import { getRobloxStudioPath } from 'roblox-studio-pathutil';

const robloxStudioPath = await getRobloxStudioPath();
```

On WSL, Roblox Studio root path is required since `/mnt/c/...` cannot be automatically resolved

```js
const robloxStudioPath = await getRobloxStudioPath(path.resolve(process.env.LOCALAPPDATA, 'Roblox'));
```

## Todo

-   Fix macOS paths

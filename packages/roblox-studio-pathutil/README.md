# roblox-studio-pathutil

> [!NOTE]  
> This package is ESM-only.

## Install

```bash
npm install roblox-studio-pathutil
```

## Usage

```js
import { getRobloxStudioPath } from 'roblox-studio-pathutil';

const robloxStudioPath = await getRobloxStudioPath();
```

### WSL

On WSL, Roblox Studio root path is required since `/mnt/c/...` cannot be automatically resolved

```js
const robloxStudioPath = await getRobloxStudioPath(path.resolve(process.env.LOCALAPPDATA, 'Roblox'));
```

Or, set `ROBLOX_STUDIO_PATH` enviroment variable.

The same enviroment name as [roblox_install][roblox-install] is used.

```bash
export ROBLOX_STUDIO_PATH="$LOCALAPPDATA/Roblox"
```

This env var is automatically checked so not need to pass it to `getRobloxStudioPath`

```js
await getRobloxStudioPath();
// Is equivalent to
await getRobloxStudioPath(process.env.ROBLOX_STUDIO_PATH);
```


Put this into `~/.zshenv` or other shell equivalent for convinience (assuming LOCALAPPDATA is `/mnt/c/Users/<user>/...`).

[roblox-install]: https://github.com/Kampfkarren/roblox-install/blob/80bd5d20dabbbc9e6c19b80cedc735279d57ad38/src/lib.rs#L15

## Todo

- Fix macOS paths

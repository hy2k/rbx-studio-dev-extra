# Develop

WSL users must set `ROBLOX_STUDIO_PATH` enviroment variable.

The same enviroment name as [roblox_install][roblox-install] is used.

```bash
export ROBLOX_STUDIO_PATH="$LOCALAPPDATA/Roblox"
```

Put this into `~/.zshenv` or other shell equivalent for convinience (assuming LOCALAPPDATA is `/mnt/c/Users/<user>/...`).

[roblox-install]: https://github.com/Kampfkarren/roblox-install/blob/80bd5d20dabbbc9e6c19b80cedc735279d57ad38/src/lib.rs#L15

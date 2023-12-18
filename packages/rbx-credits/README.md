# rbx-credits

Emits asset info, inspired by [Asset-Credits] by [@yellowfat].

This is a Node.js command-line interface (CLI) application designed to emit information about assets used in Roblox Studio.

## Usage

Please note that this application requires Node.js to run.

```bash
npx rbx-credits --place my-game.rbxl
```

The primary goal is to assist creators in giving appropriate credits for the assets they use.

The application features built-in caching to prevent multiple HTTP requests to the Roblox API for the same information.
This ensures that when a new asset is added to Studio, re-running the application is efficient.

[Asset-Credits]: https://create.roblox.com/marketplace/asset/5008136811/Asset-Credits
[@yellowfat]: https://www.roblox.com/users/104940158/profile

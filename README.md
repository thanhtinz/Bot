# Pixel Realm Menu

Minecraft Bedrock behavior pack that recreates the provided Pokemon-style menu using the stable Script API and `@minecraft/server-ui` action forms.

## Install on Realms

1. Copy `behavior_packs/pixel_menu` into your Bedrock development behavior packs folder.
2. Import or attach the behavior pack to your world.
3. Upload that world to Realms.
4. In game, use `!menu`, `!m`, or right-click/use a compass, clock, book, or recovery compass.
5. Use `!quickmenu` or `!qm` for the footer-style quick menu.

## Customizing actions

Each menu button has a `command` in `behavior_packs/pixel_menu/scripts/main.js`. Replace the placeholder `function menu/...` commands with your server commands, or create matching `.mcfunction` files in your behavior pack.

The Script API form system cannot draw a fully custom pixel-art panel like the reference image without a resource-pack UI overhaul. This pack keeps Realms/stable compatibility by using supported action form buttons, colors, line breaks, and emoji-style icons.

## Local visual preview

A browser preview is included at `preview/index.html` so you can quickly inspect the menu layout outside Minecraft:

```bash
python3 -m http.server 8765 --directory preview
```

Then open `http://127.0.0.1:8765/` in a browser. This preview is only for visual review; the actual Realms implementation remains the Script API action-form menu in `behavior_packs/pixel_menu/scripts/main.js`.

## Release files

Generated `.mcaddon` and `.zip` files are intentionally not committed right now. To create them locally after editing files, run:

```bash
./tools/package_mcaddon.sh
```

This creates `releases/pixel-realm-menu-v1.0.0.mcaddon` for Minecraft import and `releases/pixel-realm-menu-v1.0.0.zip` for sharing the full source bundle.

import { world, system } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";

const OPEN_ITEMS = new Set([
  "minecraft:compass",
  "minecraft:clock",
  "minecraft:book",
  "minecraft:recovery_compass"
]);

const MENU_OPTIONS = [
  { label: "§6🧰  KITS", color: "§6", description: "Nhận kit theo rank hoặc kit miễn phí.", command: "function menu/kits" },
  { label: "§6⏱  ONLINE\nREWARDS", color: "§6", description: "Nhận thưởng thời gian online.", command: "function menu/online_rewards" },
  { label: "§6🗓  DAILY\nREWARDS", color: "§6", description: "Nhận quà đăng nhập hằng ngày.", command: "function menu/daily_rewards" },
  { label: "§6📘  DEX\nREWARDS", color: "§6", description: "Nhận thưởng hoàn thành bộ sưu tập.", command: "function menu/dex_rewards" },
  { label: "§a🏠  HOME", color: "§a", description: "Dịch chuyển về nhà.", command: "function menu/home" },
  { label: "§a📺  GTS", color: "§a", description: "Mở khu giao dịch toàn server.", command: "function menu/gts" },
  { label: "§a🛡  WARP", color: "§a", description: "Chọn điểm warp nhanh.", command: "function menu/warp" },
  { label: "§a🔨  REPAIR\nITEM", color: "§a", description: "Sửa vật phẩm đang cầm.", command: "function menu/repair_item" },
  { label: "§b🧬  WONDER\nTRADE", color: "§b", description: "Đổi vật phẩm/Pokemon ngẫu nhiên.", command: "function menu/wonder_trade" },
  { label: "§b🛠  POKE\nBUILDER", color: "§b", description: "Mở công cụ builder.", command: "function menu/poke_builder" },
  { label: "§b🔴  PIXEL\nHUNT", color: "§b", description: "Xem mục tiêu săn hiện tại.", command: "function menu/pixel_hunt" },
  { label: "§b🏆  POKE\nTOP", color: "§b", description: "Bảng xếp hạng server.", command: "function menu/poke_top" },
  { label: "§c🏅  RANKING", color: "§c", description: "Xem ranking cá nhân và mùa giải.", command: "function menu/ranking" },
  { label: "§c⚾  GYMS", color: "§c", description: "Danh sách gym và thử thách.", command: "function menu/gyms" },
  { label: "§c👥  TEAMS", color: "§c", description: "Quản lý team của bạn.", command: "function menu/teams" }
];

const FOOTER_OPTIONS = [
  { label: "§e🗺  MAP", description: "Mở bản đồ/khu vực", command: "function menu/map" },
  { label: "§e🎀  WARDROBE", description: "Mở tủ đồ/cosmetic", command: "function menu/wardrobe" },
  { label: "§e📜  QUEST", description: "Xem nhiệm vụ", command: "function menu/quest" },
  { label: "§e📖  POKEDEX", description: "Xem Pokedex", command: "function menu/pokedex" },
  { label: "§e🐟  PROFILE", description: "Thông tin người chơi", command: "function menu/profile" },
  { label: "§e🔴  MENU", description: "Quay lại menu chính", action: "main" }
];

function pixelLine(color, text) {
  return `${color}▌ §f${text}`;
}

export async function showMainMenu(player) {
  const form = new ActionFormData()
    .title("§l§e⚡ MENU ⚡")
    .body([
      "§7╔════════════════════════════╗",
      "§e      Pixel Realm Menu",
      "§7╚════════════════════════════╝",
      "§fChọn nút bên dưới để mở tính năng.",
      "§8Dùng compass/clock/book để mở lại menu."
    ].join("\n"));

  for (const option of MENU_OPTIONS) {
    form.button(option.label);
  }

  const response = await form.show(player);
  if (response.canceled || response.selection === undefined) return;

  const selected = MENU_OPTIONS[response.selection];
  system.run(() => showOptionDetails(player, selected));
}

async function showOptionDetails(player, option) {
  const form = new ActionFormData()
    .title(`${option.color}§l${option.label.replace(/\n/g, " ")}`)
    .body([
      pixelLine(option.color, option.description),
      "",
      "§7Bạn có thể đổi command trong scripts/main.js để nối vào hệ thống server thật."
    ].join("\n"))
    .button("§a▶ Chạy tính năng")
    .button("§e↩ Quay lại menu")
    .button("§c✖ Đóng");

  const response = await form.show(player);
  if (response.canceled || response.selection === undefined) return;

  if (response.selection === 0) {
    await runConfiguredAction(player, option);
  } else if (response.selection === 1) {
    system.run(() => showMainMenu(player));
  }
}

async function showQuickMenu(player) {
  const form = new ActionFormData()
    .title("§l§e⚡ QUICK MENU")
    .body("§fCác nút dưới giống thanh icon ở ảnh mẫu.");

  for (const option of FOOTER_OPTIONS) {
    form.button(option.label);
  }

  const response = await form.show(player);
  if (response.canceled || response.selection === undefined) return;

  const selected = FOOTER_OPTIONS[response.selection];
  if (selected.action === "main") {
    system.run(() => showMainMenu(player));
    return;
  }
  await runConfiguredAction(player, selected);
}

async function runConfiguredAction(player, option) {
  try {
    await player.runCommandAsync(option.command);
  } catch (error) {
    player.sendMessage(`§e[Menu] §f${option.description}`);
    player.sendMessage("§7Chưa có function tương ứng, hãy tạo file .mcfunction hoặc đổi command trong script.");
  }
}

world.afterEvents.itemUse.subscribe((event) => {
  const player = event.source;
  const itemId = event.itemStack?.typeId;

  if (!itemId || !OPEN_ITEMS.has(itemId)) return;

  system.run(() => showMainMenu(player));
});

world.afterEvents.playerSpawn.subscribe((event) => {
  if (!event.initialSpawn) return;

  system.runTimeout(() => {
    event.player.sendMessage("§e[Menu] §fCầm và dùng §bcompass§f, §bclock§f hoặc §bbook§f để mở Pixel Realm Menu.");
  }, 40);
});

world.beforeEvents.chatSend.subscribe((event) => {
  const message = event.message.trim().toLowerCase();

  if (message === "!menu" || message === "!m") {
    event.cancel = true;
    system.run(() => showMainMenu(event.sender));
  }

  if (message === "!quickmenu" || message === "!qm") {
    event.cancel = true;
    system.run(() => showQuickMenu(event.sender));
  }
});

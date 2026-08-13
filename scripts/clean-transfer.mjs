import { existsSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const targets = ["node_modules", ".next"];

for (const target of targets) {
  const fullPath = resolve(process.cwd(), target);

  if (!existsSync(fullPath)) {
    console.log(`[skip] ${target} no existe`);
    continue;
  }

  rmSync(fullPath, { recursive: true, force: true });
  console.log(`[ok] ${target} eliminado`);
}

console.log("Limpieza finalizada. Proyecto listo para transferir.");

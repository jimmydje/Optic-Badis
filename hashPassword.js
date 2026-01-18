// hashPassword.js
import bcrypt from "bcryptjs";

async function main() {
  const plainPassword = "Admin!2026$Secure";
  const hashedPassword = await bcrypt.hash(plainPassword, 10);
  console.log("Mot de passe hashé : ", hashedPassword);
}

main();

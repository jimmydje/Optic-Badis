import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@optic.com" },
    update: {},
    create: {
      email: "admin@optic.com",
      password: hashedPassword,
      role: "ADMIN"
    }
  });

  console.log("Admin créé :", admin);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());

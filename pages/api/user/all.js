import prisma from "@/lib/db";

export default async function handler(req, res) {
  const user = await prisma.user.findMany({ include: { cards: true } });
  return res.status(200).json(user);
}

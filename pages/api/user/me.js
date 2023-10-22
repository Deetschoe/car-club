import prisma from "@/lib/db";

export default async function handler(req, res) {
  const { username } = req.query;
  if (!username) return res.status(400).json({ error: "Missing username" });

  const user = await prisma.user.findUnique({ where: { username }, include: { cards: true } });
  return res.status(200).json(user);
}

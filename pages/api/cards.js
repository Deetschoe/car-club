import prisma from "@/lib/db";

export default async function handler(req, res) {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: "Missing username" });

  const cards = await prisma.chest.findMany({ where: { user: { username } } });
  return res.status(200).json(cards);
}

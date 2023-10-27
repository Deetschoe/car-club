import prisma from "@/lib/db";

export default async function handler(req, res) {
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: "Missing username" });

  const cards = await prisma.chest.update({ where: { id }, data: { isOpened: true } });
  return res.status(200).json(cards);
}

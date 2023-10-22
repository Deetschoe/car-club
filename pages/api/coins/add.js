import prisma from "@/lib/db";

export default async function handler(req, res) {
  const { username, amount } = req.body;

  const user = await prisma.user.update({
    where: { username },
    data: { coins: { increment: amount } },
  });

  return res.status(200).json(user);
}

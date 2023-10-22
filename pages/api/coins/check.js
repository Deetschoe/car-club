import prisma from "@/lib/db";

export default async function handler(req, res) {
  const { username } = req.body;

  const user = await prisma.user.findUnique({
    where: { username },
  });

  return res.status(200).json(user);
}

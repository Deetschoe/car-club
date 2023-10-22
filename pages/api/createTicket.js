import prisma from "@/lib/db";

export default async function handler(req, res) {
  const { driveId, username } = req.body;
  if (!driveId || !username) {
    return res.status(400).json({ error: "Missing driveId and/or username" });
  }

  const rider = await prisma.rider.create({
    data: { drive: { connect: { id: driveId } }, user: { connect: { username } } },
  });

  return res.status(200).json(rider);
}

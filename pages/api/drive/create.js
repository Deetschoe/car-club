import prisma from "@/lib/db";

export default async function handler(req, res) {
  const { username, time } = req.body;
  if (!username || !time) {
    return res.status(400).json({ error: "Missing username and/or time" });
  }

  const drive = await prisma.drive.create({
    data: { departureTime: time, driver: { connect: { username } } },
  });

  return res.status(200).json(drive);
}

import prisma from "@/lib/db";
import dayjs from "dayjs";

export default async function handler(req, res) {
  const { driveId } = req.body;
  if (!driveId) {
    return res.status(400).json({ error: "Missing driveId" });
  }

  const drive = await prisma.drive.findUnique({ where: { id: driveId } });

  await prisma.drive.update({
    data: { departureTime: dayjs(drive.departureTime).add(5, "minutes") },
  });

  return res.status(200).json("ok");
}

import prisma from "@/lib/db";
import dayjs from "dayjs";

export default async function handler(req, res) {
  const { driveId } = req.body;
  if (!driveId) {
    return res.status(400).json({ error: "Missing driveId" });
  }

  const drive = await prisma.drive.update({
    where: { id: driveId },
    data: { hasLeft: true, departureTime: new Date() },
    include: { driver: true, riders: true },
  });

  // check if this is the first departure on the given day
  const drives = await prisma.drive.findMany({
    where: {
      departureTime: {
        gte: dayjs().startOf("day").toDate(),
        lt: dayjs(),
      },
    },
  });

  if (drives.length > 0) return res.status(200).json("ok");

  // this is the first departure of the day
  drive.riders.forEach(async (rider) => {
    await prisma.chest.create({
      data: { user: { connect: { username: rider.username } }, cardName: "random-card" },
    });
  });

  await prisma.chest.create({
    data: { user: { connect: { username: drive.driver.username } }, cardName: "random-card" },
  });

  return res.status(200).json("ok");
}

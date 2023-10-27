import prisma from "@/lib/db";
import dayjs from "dayjs";
import fs from "fs";
import { sample } from "underscore";

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

  if (drives.length > 1) return res.status(200).json("ok");

  const allCards = JSON.parse(fs.readFileSync("./cards.json"));
  const randomCard = sample(allCards);

  // this is the first departure of the day
  drive.riders.forEach(async (rider) => {
    await prisma.chest.create({
      data: { user: { connect: { username: rider.username } }, cardName: randomCard.name },
    });
  });

  await prisma.chest.create({
    data: { user: { connect: { username: drive.driver.username } }, cardName: randomCard.name },
  });

  return res.status(200).json("ok");
}

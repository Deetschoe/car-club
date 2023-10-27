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
    data: { hasLeft: true, departureTime: dayjs().toDate() },
    include: { driver: true, riders: { include: { user: true }} },
  });

  // check if this is the first departure on the given day
  const drives = await prisma.drive.findMany({
    where: {
      departureTime: {
        gte: dayjs().startOf("day").toDate(),
        lte: dayjs(),
      },
    },
  });

  if (drives.length > 1) return res.status(200).json("ok");

  const allCards = JSON.parse(fs.readFileSync("./cards.json"));

  // this is the first departure of the day
  drive.riders.forEach(async (rider) => {
    const randomCard = sample(allCards);

    await prisma.chest.create({
      data: { user: { connect: { username: rider.user.username } }, cardName: randomCard.name },
    });
  });

  const randomCard = sample(allCards);

  await prisma.chest.create({
    data: { user: { connect: { username: drive.driver.username } }, cardName: randomCard.name },
  });

  return res.status(200).json("ok");
}

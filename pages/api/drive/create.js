import prisma from "@/lib/db";
import dayjs from "dayjs";

export default async function handler(req, res) {
  const { username, time } = req.body;

  console.log(req.body);

  if (!username || !time) {
    return res.status(400).json({ error: "Missing username and/or time" });
  }

  const drive = await prisma.drive.create({
    data: { departureTime: dayjs(time), driver: { connect: { username } } },
  });

  return res.status(200).json(drive);
}

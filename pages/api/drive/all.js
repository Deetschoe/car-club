import prisma from "@/lib/db";
import dayjs from "dayjs";

export default async function handler(req, res) {
  const drives = await prisma.drive.findMany({
    where: { departureTime: { gte: dayjs().startOf("day").toDate() } },
    include: { driver: true, riders: true },
  });

  return res.status(200).json(drives);
}

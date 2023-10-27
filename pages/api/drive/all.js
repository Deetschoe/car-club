import prisma from "@/lib/db";
import dayjs from "dayjs";
import UTC from "dayjs/plugin/utc"
import Timezone from "dayjs/plugin/timezone"
dayjs.extend(UTC)
dayjs.extend(Timezone)
dayjs.tz.setDefault("America/New_York")

export default async function handler(req, res) {
  const drives = await prisma.drive.findMany({
    where: { departureTime: { gte: dayjs().startOf("day").toDate() } },
    include: { driver: true, riders: { include: { user: true}} },
  });

  return res.status(200).json(drives);
}

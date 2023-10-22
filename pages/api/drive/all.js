import prisma from "@/lib/db";

export default async function handler(req, res) {
  const drives = await prisma.drive.findMany({
    where: { departureTime: { gte: new Date().setHours(0, 0, 0, 0) } },
    include: { driver: true, riders: true },
  });

  return res.status(200).json(drives);
}

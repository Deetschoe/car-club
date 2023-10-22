import prisma from "@/lib/db";

export default async function handler(req, res) {
const { id } = req.query;

  const drives = await prisma.drive.findUnique({
    where: { id: parseInt(id) },
    include: { driver: true, riders: { include: { user: true }} },
  });

  return res.status(200).json(drives);
}

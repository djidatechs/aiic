import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import ftp from "ftp";


const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const link = req.nextUrl.searchParams.get("link");

    if (!link) {
      return NextResponse.json({ error: "No appointment link provided" }, { status: 400 });
    }

    const image = formData.get("image") as File | null;

    if (!image) {
      return NextResponse.json(
        { error: " image is missing." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await image.arrayBuffer());

    const client = new ftp();

    await new Promise<void>((resolve, reject) => {
      client.on("ready", resolve);
      client.on("error", reject);

      client.connect({
        host: process.env.FTP_HOST,
        user: process.env.FTP_USER,
        password: process.env.FTP_PASSWORD,
      });
    });

    console.log({client})
    client.get(".", (err,str)=>{console.log(err,str)})
    await new Promise<void>((resolve, reject) => {
      client.cwd(process.env.FTP_UPLOAD_DIR as string, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    const remotePath = generateUniqueFileName(image.name);
    await new Promise<void>((resolve, reject) => {
      client.put(buffer, remotePath, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    client.end();

    // const recitePath = `ftp://${process.env.FTP_HOST}${process.env.FTP_UPLOAD_DIR}/${remotePath}`;
    const payment = await prisma.payment.updateMany({
      where: {
        appointment: {
          link: link,
        },
      },
      data: {
        recite_path: remotePath,
      },
    });

    return NextResponse.json({ success: true, payment });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json(
      { error: "Failed to handle the request." },
      { status: 500 }
    );
  } finally {
    // Disconnect Prisma client after operation
    await prisma.$disconnect();
  }
}

function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  const extension = originalName.split(".").pop();
  return `${timestamp}_${random}.${extension}`;
}

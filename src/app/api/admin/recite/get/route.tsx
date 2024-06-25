import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import ftp from "ftp";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const recitePath = req.nextUrl.searchParams.get("recite_path");

    if (!recitePath) {
      return NextResponse.json({ error: "No recite_path provided" }, { status: 400 });
    }

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

    const imageBuffer = await new Promise<Buffer>((resolve, reject) => {
      client.get(`${process.env.FTP_UPLOAD_DIR}/${recitePath}`, (err, stream) => {
        if (err) {
          reject(err);
        } else {
          const chunks: Uint8Array[] = [];
          stream.on("data", (chunk) => chunks.push(chunk));
          stream.on("end", () => resolve(Buffer.concat(chunks)));
          stream.on("error", reject);
        }
      });
    });

    client.end();

    // Determine the MIME type based on the file extension
    const mimeType = recitePath.endsWith('.png') ? 'image/png' : 'image/jpeg';

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: { "Content-Type": mimeType },
    });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json(
      { error: "Failed to retrieve the image." },
      { status: 500 }
    );
  } finally {
    // Disconnect Prisma client after operation
    // await prisma.$disconnect();
  }
}

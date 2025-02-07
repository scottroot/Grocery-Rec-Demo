import {NextResponse} from "next/server";
import {GetObjectCommand, S3Client} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";


const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME!;
const S3_REGION = process.env.S3_REGION!;
const s3Client = new S3Client({
  region: S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});


export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = Number(searchParams.get('userId') || 0);
  if (!userId) {
    return NextResponse.json({ error: "You forgot to provide a User ID..." }, { status: 400 });
  }

  const fileKey = `${S3_BUCKET_NAME}/${userId}.json`;
  const command = new GetObjectCommand({ Bucket: S3_BUCKET_NAME, Key: fileKey });

  try {
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 1800 }); // 1 hour expiry
    return NextResponse.json({ url: signedUrl });
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate signed URL" }, { status: 500 });
  }
}
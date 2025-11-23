import type { VercelRequest, VercelResponse } from '@vercel/node';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { filename, contentType } = req.body as { filename?: string; contentType?: string };
  if (!filename) {
    res.status(400).json({ error: 'filename is required' });
    return;
  }

  const bucket = process.env.S3_BUCKET;
  const region = process.env.S3_REGION;
  const accessKey = process.env.S3_ACCESS_KEY;
  const secretKey = process.env.S3_SECRET_KEY;

  if (!bucket || !region || !accessKey || !secretKey) {
    res.status(500).json({ error: 'S3 not configured on server' });
    return;
  }

  const sanitized = filename.replace(/[^a-zA-Z0-9.\-_]/g, '_');
  const key = `uploads/${Date.now()}-${Math.round(Math.random() * 1e9)}-${sanitized}`;

  const s3 = new S3Client({ region, credentials: { accessKeyId: accessKey, secretAccessKey: secretKey } });
  const command = new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType || 'application/pdf' });

  try {
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    res.json({ url, key });
  } catch (e) {
    console.error('Failed to create presign URL', e);
    res.status(500).json({ error: 'Failed to create presign URL' });
  }
}

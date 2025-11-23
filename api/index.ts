import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getApp } from '../server/index';

// Vercel's Node runtime will call this handler for incoming requests to /api
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const app = await getApp();
  // Express apps are request handlers themselves
  return app(req as any, res as any);
}

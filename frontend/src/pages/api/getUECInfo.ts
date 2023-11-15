import type { NextApiRequest, NextApiResponse } from "next";
import { getUECInfo } from "@/apiClient";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    const message = req.body.message;
    const data = await getUECInfo(message);
    res.status(200).json(data)
  }
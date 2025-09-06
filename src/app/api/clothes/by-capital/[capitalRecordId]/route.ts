import { NextRequest, NextResponse } from "next/server";
import dbConnect from '@/lib/dbConnect';
import Clothes from "@/models/clothes";

// GET /api/clothes/by-capital/:capitalRecordId
export async function GET(req: NextRequest, { params }: { params: { capitalRecordId: string } }) {
  await dbConnect();
  const { capitalRecordId } = params;
  try {
    const clothes = await Clothes.find({ capitalRecordId });
    return NextResponse.json(clothes);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch clothes by capitalRecordId" }, { status: 500 });
  }
}

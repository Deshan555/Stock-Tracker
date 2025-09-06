import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Clothes from '@/models/clothes';

export async function GET() {
  await dbConnect();
  const clothes = await Clothes.find({}).sort({ createdAt: -1 });
  return NextResponse.json(clothes);
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const data = await req.json();
  const item = await Clothes.create(data);
  return NextResponse.json(item, { status: 201 });
}

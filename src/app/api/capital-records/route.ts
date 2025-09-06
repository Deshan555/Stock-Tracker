import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import CapitalRecord from '@/models/capitalRecord';

export async function GET() {
  await dbConnect();
  const records = await CapitalRecord.find({}).sort({ createdAt: -1 });
  return NextResponse.json(records);
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const data = await req.json();
  const record = await CapitalRecord.create(data);
  return NextResponse.json(record, { status: 201 });
}

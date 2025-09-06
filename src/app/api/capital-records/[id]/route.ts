import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import CapitalRecord from '@/models/capitalRecord';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const record = await CapitalRecord.findById(params.id);
  if (!record) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(record);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const data = await req.json();
  const record = await CapitalRecord.findByIdAndUpdate(params.id, data, { new: true });
  if (!record) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(record);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const record = await CapitalRecord.findByIdAndDelete(params.id);
  if (!record) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Transaction from '@/models/transaction';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const transaction = await Transaction.findById(params.id);
  if (!transaction) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(transaction);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const data = await req.json();
  const transaction = await Transaction.findByIdAndUpdate(params.id, data, { new: true });
  if (!transaction) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(transaction);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const transaction = await Transaction.findByIdAndDelete(params.id);
  if (!transaction) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}

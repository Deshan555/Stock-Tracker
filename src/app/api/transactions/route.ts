import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Transaction from '@/models/transaction';

export async function GET() {
  await dbConnect();
  const transactions = await Transaction.find({}).sort({ createdAt: -1 });
  return NextResponse.json(transactions);
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const data = await req.json();
  const transaction = await Transaction.create(data);
  return NextResponse.json(transaction, { status: 201 });
}

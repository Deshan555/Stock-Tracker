import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Clothes from '@/models/clothes';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const item = await Clothes.findById(params.id);
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const { stockStatus, salePrice, discountedPrice } = await req.json();
  const update: any = {};
  if (stockStatus !== undefined) update.stockStatus = stockStatus;
  if (salePrice !== undefined) update.salePrice = salePrice;
  if (discountedPrice !== undefined) update.discountedPrice = discountedPrice;
  const item = await Clothes.findByIdAndUpdate(params.id, update, { new: true });
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(item);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const item = await Clothes.findByIdAndDelete(params.id);
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}

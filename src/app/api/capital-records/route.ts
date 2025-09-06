
import Clothes from '@/models/clothes';
import dbConnect from '@/lib/dbConnect';
import CapitalRecord from '@/models/capitalRecord';
import { NextResponse, NextRequest } from 'next/server';

export async function GET() {
  await dbConnect();
  const records = await CapitalRecord.find({}).sort({ createdAt: -1 }).lean();
  const clothes = await Clothes.find({}).lean();

  const recordsWithStats = records.map(record => {
    const rec: any = record;
    const relatedClothes = clothes.filter(c => c.capitalRecordId?.toString() === rec._id.toString());
    const totalItems = relatedClothes.reduce((sum, c) => sum + (c.quantity || 0), 0);
    const remainingItems = relatedClothes.filter(c => c.stockStatus === 'IN_STOCK' || c.stockStatus === 'LOW_STOCK').reduce((sum, c) => sum + (c.quantity || 0), 0);
    const totalSell = relatedClothes.reduce((sum, c) => sum + ((c.salePrice || 0) * (c.quantity || 0)), 0);
    const expectedIncome = relatedClothes.reduce((sum, c) => sum + (((c.salePrice || 0) - (c.prisedPrice || 0)) * (c.quantity || 0)), 0);
    const spent = relatedClothes.reduce((sum, c) => sum + ((c.wholesalePrice || 0) * (c.quantity || 0)), 0);
    const remainingBalance = record.amountInvested - spent;
    return {
      ...record,
      totalItems,
      remainingItems,
      totalSell,
      expectedIncome,
      remainingBalance,
    };
  });
  return NextResponse.json(recordsWithStats);
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const data = await req.json();
  const record = await CapitalRecord.create(data);
  return NextResponse.json(record, { status: 201 });
}

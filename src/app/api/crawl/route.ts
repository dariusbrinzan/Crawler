// src/app/api/crawl/route.ts
import { NextResponse } from 'next/server';
import { crawlPAP } from '@/lib/crawler';
import { createObjectCsvWriter } from 'csv-writer';

export async function GET() {
  try {
    // 1. Rulăm crawler-ul
    const data = await crawlPAP();

    // 2. Scriem direct într-un CSV (în rădăcina proiectului):
    const csvWriter = createObjectCsvWriter({
      path: 'pap.csv', // se salvează în root
      header: [
        { id: 'site', title: 'SITE' },
        { id: 'text', title: 'TEXT' },
        { id: 'href', title: 'LINK' },
      ],
      append: false, 
    });

    await csvWriter.writeRecords(data);
    console.log('CSV generat cu succes!');

    // 3. Returnăm JSON la client
    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error('Eroare la crawl:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

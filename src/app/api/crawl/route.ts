import { NextResponse } from 'next/server';
import { crawlPAP } from '@/lib/crawler';
import { createObjectCsvWriter } from 'csv-writer';

export async function GET() {
  try {
    const data = await crawlPAP();

    const csvWriter = createObjectCsvWriter({
      path: 'pap.csv',
      header: [
        { id: 'site', title: 'Site administrație' },
        { id: 'title', title: 'Titlu' },
        { id: 'url', title: 'URL' },
        { id: 'format', title: 'Format document' },
        { id: 'date', title: 'Dată colectare' },
      ],
      append: false,
    });

    await csvWriter.writeRecords(data);
    console.log('CSV generat cu succes!');

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

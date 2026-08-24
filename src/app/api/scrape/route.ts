import { NextResponse } from 'next/server';
import ky from 'ky';
import { endpoints } from '@/utils/constants';

const SCRAPPER_BASE_URL = process.env.SCRAPPER_BASE_URL

export async function POST(req: Request) {
  const body = await req.json();

  // Forward payload to FastAPI background worker
  const data = await ky
    .post(SCRAPPER_BASE_URL + endpoints.external.scrapper.MAIN, {
      headers: {
        Authorization: `Bearer ${process.env.SCRAPER_API_KEY}`,
      },
      json: {
        locations: body.locations,
        minPrice: body.minPrice,
        maxPrice: body.maxPrice,
        minSpace: body.minSpace,
        minRooms: body.minRooms,
        minBedrooms: body.minBedrooms,
      },
    })
    .json<{ success: boolean; message: string; filters: Record<string, unknown> }>()
    .catch((err: Error) => ({
      success: false,
      message: err.message || 'FastAPI service execution failed.',
      filters: {},
    }));

  if (!data.success) {
    return NextResponse.json(
      { success: false, message: data.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: data.message || 'Scraping job queued successfully.',
    filters: data.filters,
  });
}
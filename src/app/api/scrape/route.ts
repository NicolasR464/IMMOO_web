import { exec } from 'child_process';
import { NextResponse } from 'next/server';
import util from 'util';

const execAsync = util.promisify(exec);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Map UI payload to environment variable overrides for Python pipeline
    const env = {
      ...process.env,
      SEARCH_MIN_PRICE: body.minPrice.toString(),
      SEARCH_MAX_PRICE: body.maxPrice.toString(),
      SEARCH_MIN_SPACE: body.minSpace.toString(),
      SEARCH_MIN_ROOMS: body.minRooms.toString(),
      SEARCH_LOCATIONS: body.locations.join(','),
    };

    // Execute Python CLI scraper package using uv
    const { stdout, stderr } = await execAsync('uv run python -m src.cli', { env });

    return NextResponse.json({
      success: true,
      message: 'Scraper execution completed.',
      output: stdout,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
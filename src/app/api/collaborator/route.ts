import { NextResponse } from 'next/server';
import { auth } from '@/handlers/auth';
import ky from 'ky';
import { endpoints } from '@/utils/constants';

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.accessToken) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized: Missing Google OAuth token.' },
      { status: 401 }
    );
  }

  const body = await req.json();


  console.log({body})

  const data = await ky
    .post(process.env.SCRAPPER_BASE_URL + endpoints.external.scrapper.ADD_COLLABORATOR, {
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
      json: body,
      timeout: 30000,
    })
    .json<{ success: boolean; message: string }>()
    .catch((err: Error) => ({
      success: false,
      message: err.message || 'Failed to add collaborator column.',
    }));

  return NextResponse.json(data);
}
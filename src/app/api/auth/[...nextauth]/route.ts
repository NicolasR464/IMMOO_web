import { NextRequest } from 'next/server'

import { handlers } from '@/handlers/auth'

const PUBLIC_ORIGIN = process.env.PUBLIC_APP_URL!

const withPublicOrigin = (request: NextRequest): NextRequest => {
    const publicUrl = new URL(
        `${request.nextUrl.pathname}${request.nextUrl.search}`,
        PUBLIC_ORIGIN,
    )

    return new NextRequest(publicUrl, {
        method: request.method,
        headers: request.headers,
        body:
            request.method === 'GET' || request.method === 'HEAD'
                ? undefined
                : request.body,
    })
}

export const GET = (request: NextRequest) =>
    handlers.GET(withPublicOrigin(request))

export const POST = (request: NextRequest) =>
    handlers.POST(withPublicOrigin(request))

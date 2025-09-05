/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const debugInfo = {
      timestamp: new Date().toISOString(),
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        NEXT_PUBLIC_STORAGE_TYPE: process.env.NEXT_PUBLIC_STORAGE_TYPE,
        USERNAME: process.env.USERNAME ? '***' : undefined,
        PASSWORD: process.env.PASSWORD ? '***' : undefined,
      },
      globalThis: {
        hasDB: typeof globalThis !== 'undefined' && !!(globalThis as any).DB,
        hasProcess: typeof globalThis !== 'undefined' && !!(globalThis as any).process,
        hasCloudflare: typeof globalThis !== 'undefined' && !!(globalThis as any).cloudflare,
      },
      processEnv: {
        hasDB: !!(process.env as any).DB,
        keys: Object.keys(process.env).filter(key => 
          key.startsWith('DB') || 
          key.startsWith('NEXT_') || 
          key.startsWith('CF_') ||
          key.startsWith('CLOUDFLARE_')
        ),
      },
      runtime: 'edge',
      userAgent: request.headers.get('user-agent')?.slice(0, 100),
    };

    return NextResponse.json(debugInfo);
  } catch (error) {
    return NextResponse.json({
      error: 'Debug info collection failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

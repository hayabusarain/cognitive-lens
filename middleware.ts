import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl.pathname;
  
  // ジェネレーター画面とそれを支える裏口APIへのアクセスをすべて監視・保護する
  if (url.startsWith('/video-gen') || url.startsWith('/api/render-video') || url.startsWith('/api/video-gen')) {
    
    // BASIC認証のヘッダーを読み取る
    const basicAuth = req.headers.get('authorization');
    
    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1];
      // Base64をデコード（Edge Runtimeで動作するため atob を使用）
      const [user, pwd] = atob(authValue).split(':');
      
      // 管理者のIDとパスワード（admin / mbti2026）
      if (user === 'admin' && pwd === 'mbti2026') {
        return NextResponse.next();
      }
    }
    
    // 認証失敗時、ブラウザ標準のパスワード入力画面を強制的に表示させる
    return new NextResponse('Authentication Required.', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
      },
    });
  }

  // それ以外の一般ユーザー向け画面（ホームページや診断画面）は何もしないで通す
  return NextResponse.next();
}

// どのPATHに対してミドルウェアを起動するか指定
export const config = {
  matcher: ['/video-gen/:path*', '/api/render-video/:path*', '/api/video-gen/:path*'],
};

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://www.onlinegames.io/media/plugins/genGames/embed.json', {
      next: { revalidate: 60 }, // 缓存60秒
    });
    
    if (!response.ok) {
      throw new Error(`获取游戏失败: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API路由中获取游戏数据出错:', error);
    return NextResponse.json(
      { error: '获取游戏数据时出错' },
      { status: 500 }
    );
  }
}

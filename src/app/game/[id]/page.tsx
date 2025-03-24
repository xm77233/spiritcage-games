'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Game {
  id?: string | number;
  title: string;
  embed: string;
  image: string;
  description?: string;
  tags?: string[] | string | any;
}

export default function GamePage() {
  const params = useParams();
  const id = params.id as string;
  
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGameDetails() {
      try {
        console.log('获取游戏详情，ID:', id);
        const response = await fetch('/api/games');
        
        if (!response.ok) {
          throw new Error(`获取游戏失败: ${response.status}`);
        }
        
        const games = await response.json();
        
        if (!Array.isArray(games)) {
          console.error('API返回的不是数组格式');
          setError('API返回的不是数组格式');
          setGame(null);
        } else {
          // 为每个游戏添加唯一ID（如果API中没有提供）
          const gamesWithIds = games.map((game: any, index: number) => ({
            ...game,
            id: game.id || index + 1
          }));
          
          const foundGame = gamesWithIds.find((g: Game) => 
            g.id !== undefined && g.id.toString() === id
          );
          
          if (foundGame) {
            console.log('找到游戏:', foundGame);
            setGame(foundGame);
          } else {
            console.log('在API数据中找不到游戏');
            setError('找不到该游戏');
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('获取游戏详情时出错:', error);
        setError('获取游戏数据时出错，请稍后再试');
        setLoading(false);
      }
    }

    fetchGameDetails();
  }, [id]);

  if (loading) {
    return <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>加载中...</div>;
  }

  if (error || !game) {
    return (
      <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>{error || '游戏未找到'}</h2>
        <Link href="/">返回首页</Link>
      </div>
    );
  }

  // 处理tags字段，确保它是一个数组
  let tagsArray: string[] = [];
  if (game.tags) {
    if (Array.isArray(game.tags)) {
      tagsArray = game.tags;
    } else if (typeof game.tags === 'string') {
      // 如果tags是字符串，假设它是逗号分隔的
      tagsArray = game.tags.split(',').map(tag => tag.trim());
    } else if (typeof game.tags === 'object') {
      // 如果tags是对象，尝试提取值
      tagsArray = Object.values(game.tags).map(tag => String(tag));
    }
  }

  return (
    <main>
      <header>
        <div className="container">
          <h1>{game.title}</h1>
        </div>
      </header>

      <div className="container" style={{ padding: '2rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <Link href="/" style={{ display: 'inline-block', marginBottom: '1rem' }}>
            &larr; 返回游戏列表
          </Link>
          <h2>{game.title}</h2>
          <p>{game.description || '没有描述'}</p>
          {tagsArray.length > 0 && (
            <div style={{ margin: '0.5rem 0' }}>
              {tagsArray.map((tag, index) => (
                <span key={index} style={{ 
                  background: '#f0f0f0', 
                  padding: '2px 8px', 
                  borderRadius: '4px',
                  marginRight: '5px',
                  fontSize: '0.8rem'
                }}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div style={{ position: 'relative', overflow: 'hidden', paddingTop: '56.25%', margin: '2rem 0' }}>
          <iframe 
            src={game.embed} 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 'none'
            }}
            allowFullScreen
            title={game.title}
          ></iframe>
        </div>
      </div>

      <footer>
        <div className="container">
          <p>&copy; 2025 Spirit Cage 游戏空间 | <a href="https://spiritcage.space">spiritcage.space</a></p>
        </div>
      </footer>
    </main>
  );
}

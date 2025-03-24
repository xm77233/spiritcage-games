'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Game {
  id?: string | number;
  title: string;
  embed: string;  // 修改为API中实际的iframe URL字段
  image: string;  // 修改为API中实际的图片字段
  description?: string;
  tags?: string[];
}

export default function Home() {
  const [games, setGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGames() {
      try {
        console.log('开始获取游戏数据...');
        const response = await fetch('/api/games');
        console.log('API响应状态:', response.status);
        
        if (!response.ok) {
          throw new Error(`获取游戏失败: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('获取到的游戏数据:', data);
        
        // 检查数据是否是数组
        if (!Array.isArray(data)) {
          setError('API返回的不是数组格式');
          setGames([]);
          setFilteredGames([]);
        } else {
          console.log(`成功获取到 ${data.length} 个游戏`);
          
          // 为每个游戏添加唯一ID（如果API中没有提供）
          const gamesWithIds = data.map((game, index) => ({
            ...game,
            id: game.id || index + 1
          }));
          
          setGames(gamesWithIds);
          setFilteredGames(gamesWithIds);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('获取游戏时出错:', error);
        setError('获取游戏数据时出错，请稍后再试');
        setLoading(false);
      }
    }

    fetchGames();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredGames(games);
    } else {
      const filtered = games.filter(game => 
        game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (game.description && game.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (game.tags && game.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
      setFilteredGames(filtered);
    }
  }, [searchTerm, games]);

  return (
    <main>
      <header>
        <div className="container">
          <h1>Spirit Cage 游戏空间</h1>
          <p>在线游戏精选</p>
        </div>
      </header>
      
      <div className="container">
        <div className="search-bar">
          <input 
            type="text" 
            id="search-input" 
            placeholder="搜索游戏..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {loading ? (
          <p>加载游戏中...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : filteredGames.length > 0 ? (
          <div className="games-grid">
            {filteredGames.map(game => (
              <div key={game.id} className="game-card">
                <div style={{ position: 'relative', width: '100%', height: '180px' }}>
                  <Image
                    src={game.image || 'https://via.placeholder.com/300x180'}
                    alt={game.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="game-info">
                  <h3>{game.title}</h3>
                  <p>{game.description || '没有描述'}</p>
                  <Link href={`/game/${game.id}`} className="play-button">
                    开始游戏
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>未找到游戏。</p>
        )}
      </div>
      
      <footer>
        <div className="container">
          <p>&copy; 2025 Spirit Cage 游戏空间 | <a href="https://spiritcage.space">spiritcage.space</a></p>
        </div>
      </footer>
    </main>
  );
}

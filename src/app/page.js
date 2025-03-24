'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchGames() {
      try {
        const response = await fetch('https://www.onlinegames.io/media/plugins/genGames/embed.json');
        if (!response.ok) {
          throw new Error('Failed to fetch games');
        }
        const data = await response.json();
        setGames(data);
        setFilteredGames(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching games:', error);
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
        game.title.toLowerCase().includes(searchTerm.toLowerCase())
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
        ) : (
          <div className="games-grid">
            {filteredGames.map(game => (
              <div key={game.id} className="game-card">
                <div style={{ position: 'relative', width: '100%', height: '180px' }}>
                  <Image
                    src={game.thumbnail || 'https://via.placeholder.com/300x180'}
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

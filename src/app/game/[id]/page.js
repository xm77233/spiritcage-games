'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function GamePage({ params }) {
  const { id } = params;
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGameDetails() {
      try {
        const response = await fetch('https://www.onlinegames.io/media/plugins/genGames/embed.json');
        if (!response.ok) {
          throw new Error('Failed to fetch games');
        }
        const games = await response.json();
        const foundGame = games.find(g => g.id.toString() === id);
        
        if (foundGame) {
          setGame(foundGame);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching game details:', error);
        setLoading(false);
      }
    }

    fetchGameDetails();
  }, [id]);

  if (loading) {
    return <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>加载中...</div>;
  }

  if (!game) {
    return (
      <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>游戏未找到</h2>
        <Link href="/">返回首页</Link>
      </div>
    );
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
        </div>

        <div style={{ position: 'relative', overflow: 'hidden', paddingTop: '56.25%', margin: '2rem 0' }}>
          <iframe 
            src={game.iframe_url || `https://www.onlinegames.io/games/${game.id}/`} 
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

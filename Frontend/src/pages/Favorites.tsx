// src/pages/Favorites.tsx
import React, { useState } from 'react';
import FavoriteItem from '../components/FavoriteItem';

interface Food {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
}

const initialFavorites: Food[] = [
  { id: 1, name: 'Phở Bò', description: 'Món phở truyền thống Việt Nam', imageUrl: 'https://example.com/pho.jpg' },
  { id: 2, name: 'Bánh mì', description: 'Bánh mì pate thơm ngon', imageUrl: 'https://example.com/banhmi.jpg' },
  { id: 3, name: 'Gỏi cuốn', description: 'Gỏi cuốn tươi mát', imageUrl: 'https://example.com/goicuon.jpg' },
];

const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState<Food[]>(initialFavorites);

  const handleRemove = (id: number) => {
    setFavorites(favorites.filter(item => item.id !== id));
  };

  return (
    <div style={{
      maxWidth: '100%',
      margin: '0 auto',
      padding: '16px',
      boxSizing: 'border-box',
      minHeight: '100vh',
      backgroundColor: '#f8f9fa'
    }}>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        padding: '20px'
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '600',
          marginBottom: '24px',
          color: '#333',
          textAlign: 'center'
        }}>
          Món ăn yêu thích
        </h1>
        
        {favorites.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#666'
          }}>
            <p style={{ marginBottom: '16px' }}>Chưa có món ăn yêu thích nào.</p>
            <button 
              style={{
                padding: '10px 20px',
                backgroundColor: '#ff6b6b',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
              onClick={() => setFavorites(initialFavorites)}
            >
              Thêm món ăn mẫu
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gap: '16px'
          }}>
            {favorites.map(item => (
              <FavoriteItem
                key={item.id}
                id={item.id}
                name={item.name}
                description={item.description}
                imageUrl={item.imageUrl}
                onRemove={handleRemove}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
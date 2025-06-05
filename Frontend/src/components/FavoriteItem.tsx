// src/components/FavoriteItem.tsx
import React from 'react';

interface FavoriteItemProps {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  onRemove: (id: number) => void;
}

const FavoriteItem: React.FC<FavoriteItemProps> = ({ id, name, description, imageUrl, onRemove }) => {
  return (
    <div style={{ border: '1px solid #ddd', padding: 10, marginBottom: 10, borderRadius: 5, display: 'flex', alignItems: 'center' }}>
      {imageUrl && <img src={imageUrl} alt={name} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 5, marginRight: 15 }} />}
      <div style={{ flex: 1 }}>
        <h3>{name}</h3>
        {description && <p>{description}</p>}
      </div>
      <button onClick={() => onRemove(id)} style={{ cursor: 'pointer', backgroundColor: '#ff4d4d', border: 'none', color: 'white', padding: '5px 10px', borderRadius: 4 }}>
        Xóa
      </button>
    </div>
  );
};

export default FavoriteItem;

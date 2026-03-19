import React from 'react';
import { Filter, ChevronDown, Rocket, Star, Clock } from 'lucide-react';

const FilterBar = ({ activeFilter, setActiveFilter, sortBy, setSortBy }) => {
  const cuisines = ["All", "Indian", "Chinese", "Italian", "Japanese", "Fast Food"];
  
  return (
    <div style={{ marginBottom: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        {/* Cuisines Chips */}
        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '10px' }}>
          {cuisines.map((c) => (
            <button
              key={c}
              onClick={() => setActiveFilter(c === "All" ? "" : c)}
              style={{
                padding: '8px 20px',
                borderRadius: '50px',
                border: '1px solid #eee',
                background: (activeFilter === c || (c === "All" && !activeFilter)) ? '#ff4b2b' : '#fff',
                color: (activeFilter === c || (c === "All" && !activeFilter)) ? '#fff' : '#636e72',
                fontWeight: 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.3s'
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '10px 35px 10px 15px',
                borderRadius: '12px',
                border: '1px solid #eee',
                background: '#fff',
                appearance: 'none',
                cursor: 'pointer',
                fontWeight: 500,
                color: '#2d3436'
              }}
            >
              <option value="">Sort by: Relevance</option>
              <option value="ratings">Top Rated</option>
              <option value="deliveryTime">Fastest Delivery</option>
              <option value="avgPrice">Price: Low to High</option>
            </select>
            <ChevronDown size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

const quickFilterStyle = {
  background: '#fff',
  border: '1px solid #eee',
  padding: '6px 14px',
  borderRadius: '8px',
  fontSize: '0.85rem',
  color: '#636e72',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  cursor: 'pointer'
};

export default FilterBar;

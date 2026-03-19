import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  Legend
} from 'recharts';

export const RevenueChart = ({ data, onRangeChange, currentRange = "7D", title = "Revenue Trend" }) => {
  const ranges = ["7D", "30D", "3M", "1Y"];

  return (
    <div style={chartCardStyle}>
      <div style={chartHeaderStyle}>
        <h3 style={chartTitleStyle}>{title}</h3>
        <div style={filterGroupStyle}>
          {ranges.map((range) => (
            <button
              key={range}
              onClick={() => onRangeChange(range)}
              style={{
                ...filterBtnStyle,
                ...(currentRange === range ? activeFilterStyle : {})
              }}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div style={{ height: '350px', width: '100%', marginTop: '10px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff4b2b" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#ff4b2b" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#4b4b4b', fontSize: 12, fontWeight: 600 }}
              dy={15}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#4b4b4b', fontSize: 12, fontWeight: 600 }}
              tickFormatter={(value) => `₹${value}`}
              dx={-10}
            />
            <Tooltip 
              contentStyle={tooltipStyle}
              cursor={{ stroke: '#ff4b2b', strokeWidth: 2, strokeDasharray: '5 5' }}
              formatter={(value) => [`₹${value}`, 'Revenue']}
              animationDuration={300}
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#ff4b2b" 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
              animationDuration={1500}
              activeDot={{ r: 6, stroke: '#fff', strokeWidth: 3, fill: '#ff4b2b' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const chartHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '10px'
};

const filterGroupStyle = {
  display: 'flex',
  background: '#f8f9fc',
  padding: '4px',
  borderRadius: '12px',
  gap: '4px'
};

const filterBtnStyle = {
  padding: '6px 14px',
  border: 'none',
  background: 'transparent',
  color: '#636e72',
  fontSize: '0.8rem',
  fontWeight: 700,
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'all 0.3s ease'
};

const activeFilterStyle = {
  background: '#fff',
  color: '#ff4b2b',
  boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
};

export const PopularItemsChart = ({ data }) => {
  const COLORS = ['#ff4b2b', '#ff416c', '#3498db', '#2ecc71', '#f1c40f'];

  return (
    <div style={chartCardStyle}>
      <h3 style={chartTitleStyle}>Top Performing Dishes</h3>
      <div style={{ height: '300px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 40, right: 40 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: '#2d3436', fontSize: 12, fontWeight: 700 }}
              width={100}
            />
            <Tooltip 
              contentStyle={tooltipStyle}
              cursor={{ fill: '#f8f9fc' }}
              formatter={(value) => [value, 'Orders']}
            />
            <Bar dataKey="count" radius={[0, 10, 10, 0]} barSize={20}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const chartCardStyle = {
  background: '#fff',
  borderRadius: '24px',
  padding: '30px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
  border: '1px solid #edf2f7',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px'
};

const chartTitleStyle = {
  fontSize: '1.2rem',
  fontWeight: 800,
  color: '#2d3436',
  margin: 0
};

const tooltipStyle = {
  background: '#fff',
  border: 'none',
  borderRadius: '12px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  padding: '10px 15px'
};

import React from 'react';
import StockChart from './charts/StockChart';
import stockData from './data'
const App = () => {
  return (
    <div style={{ width: '100%', height: '500px' }}>
      <StockChart priceData={stockData} />
    </div>
  );
};

export default App;

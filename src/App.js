import React, { useState } from 'react';
//import StockChart from './charts/StockChart';
//import stockData from './data'
import TradingDashboard from './dashboard/dashboard'
const App = () => {
//   const [selectedIndicators, setSelectedIndicators] = useState([]);
//
//
//  const handleIndicatorChange = (event) => {
//    const { value, checked } = event.target;
//     setSelectedIndicators(prevIndicators => {
//    // Only add if checked and not already in the list, otherwise remove
//    if (!prevIndicators.includes(value)) {
//      return [...prevIndicators, value];
//    } else if (prevIndicators.includes(value)) {
//      return prevIndicators.filter(indicator => indicator !== value);
//    }
//    return prevIndicators;
//  });
//  };

  return (
    <div style={{ width: '100%', height: '500px' }}>
    {/*<label htmlFor="indicators">Select Indicator: </label>
      <select id="indicators" value={selectedIndicators} onChange={handleIndicatorChange}>
        <option value="">None</option>
        <option value="sma">Simple Moving Average (SMA)</option>
        <option value="ema">Exponential Moving Average (EMA)</option>
        <option value="rsi">Relative Strength Index (RSI)</option>
        <option value="candle">CandleSticks</option>
      </select>
      <StockChart priceData={stockData}  indicators={selectedIndicators}  />*/}
        <TradingDashboard />
    </div>
  );
};

export default App;

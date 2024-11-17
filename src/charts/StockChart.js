import React, {useEffect, useState} from 'react';
import Plot from 'react-plotly.js';

// Helper function to calculate Simple Moving Average (SMA)
const calculateSMA = (data, window) => {
  const sma = [];
  for (let i = 0; i < data.length; i++) {
    if (i < window - 1) {
      sma.push(null); // No SMA value until the window size is reached
    } else {
      const sum = data.slice(i - window + 1, i + 1).reduce((a, b) => a + b, 0);
      sma.push(sum / window);
    }
  }
  return sma;
};

// Helper function to calculate Exponential Moving Average (EMA)
const calculateEMA = (data, window) => {
  const ema = [];
  const k = 2 / (window + 1); // Smoothing factor
  let previousEma = data[0]; // Start with the first price

  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      ema.push(data[0]); // The first value is the first price
      continue;
    }
    const currentEma = (data[i] - previousEma) * k + previousEma;
    ema.push(currentEma);
    previousEma = currentEma; // Update previous EMA
  }
  return ema;
};

const StockChart = ({ priceData, indicators }) => {
    const [plotData, setPlotData] = useState([
        {
          x: priceData.map(data => data.timestamp),         // Same x-values for close prices
          y: priceData.map(data => data.close),        // Close prices for the line
          type: 'scatter',
          mode: 'lines',                       // Line with markers
          line: { color: 'lightblue' },                     // Color for the close price line
          name: 'Close Price',                        // Legend entry
        }])
console.log(indicators)

    useEffect(() => {
        var plotArray = [{
          x: priceData.map(data => data.date),         // Same x-values for close prices
          y: priceData.map(data => data.close),        // Close prices for the line
          type: 'scatter',
          mode: 'lines',                       // Line with markers
          line: { color: 'lightblue' },                     // Color for the close price line
          name: 'Close Price',                        // Legend entry
        }]
        for(const indicator of indicators) {
            if(indicator == 'candle') {
                plotArray.push({
                  x: priceData.map(data => data.date),        // Dates for each candle
                  open: priceData.map(data => data.open),     // Open prices
                  high: priceData.map(data => data.high),     // High prices
                  low: priceData.map(data => data.low),       // Low prices
                  close: priceData.map(data => data.close),   // Close prices
                  type: 'candlestick',
                  xaxis: 'x',
                  yaxis: 'y',
                })
            }
        }
        setPlotData(plotArray);
    }, [indicators]);
    console.log(plotData)
  return (
    <Plot
      data={plotData}
      layout={{
        title: 'Candlestick Chart (Daily Stock Prices)',
        xaxis: {
          type: 'date',
//          rangeslider: { visible: true },            // Adds a range slider for zooming and panning
          fixedrange: false,
        },
        yaxis: {
          title: 'Price (USD)',
          fixedrange: false,
        },
      }}
      config={{
        scrollZoom: true,                            // Enables zooming with the mouse wheel
        responsive: true,
        displayModeBar: true,
      }}
      style={{ height: "100%" }}
    />
  );
};

export default StockChart;

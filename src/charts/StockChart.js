import React from 'react';
import Plot from 'react-plotly.js';

const StockChart = ({ priceData }) => {
  return (
    <Plot
      data={[
//        {
//          x: priceData.map(data => data.date),        // Dates for each candle
//          open: priceData.map(data => data.open),     // Open prices
//          high: priceData.map(data => data.high),     // High prices
//          low: priceData.map(data => data.low),       // Low prices
//          close: priceData.map(data => data.close),   // Close prices
//          type: 'candlestick',
//          xaxis: 'x',
//          yaxis: 'y',
//        },
        {
          x: priceData.map(data => data.date),         // Same x-values for close prices
          y: priceData.map(data => data.close),        // Close prices for the line
          type: 'scatter',
          mode: 'lines',                       // Line with markers
          line: { color: 'lightblue' },                     // Color for the close price line
          name: 'Close Price',                        // Legend entry
        },
      ]}
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
      style={{ width: "100%", height: "200%" }}
    />
  );
};

export default StockChart;

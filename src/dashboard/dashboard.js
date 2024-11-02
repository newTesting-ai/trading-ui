import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Activity, PieChart, AlertCircle } from 'lucide-react';

import Plot from 'react-plotly.js';
import metrics from '../data'

const TradingDashboard = () => {
  const [timeRange, setTimeRange] = useState('all');
  // Format timestamp to readable date
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString();
  };

  // Calculate win rate
  const winRate = (metrics.winning_trades / metrics.no_of_trades * 100).toFixed(2);

  // Process chart data
  const processChartData = (oldData, drawdown=false) => {
//    const oldData = data.slice(0, 100)
    let res;
    if(drawdown == false) {
      res = [{
        type: 'scatter',
        mode: 'lines',                       // Line with markers
        line: { color: 'lightblue' },                     // Color for the close price line
        name: 'Close Price',    
        x: oldData.map((_, index) => index),
        y: oldData.map(item => item.value)
      }];  
    } else {

      const profitData = oldData.map((item, index) => (item.value >= 0 ? item.value : null));
      const lossData = oldData.map((item, index) => (item.value < 0 ? item.value : null));

      res = [
         {
          x: profitData.map((_, index) => index), // Assuming data has a sequential time index
          y: profitData,
          fill: 'tozeroy',
          type: 'scatter',
          mode: 'lines',
          line: { color: 'green' },
          name: 'Profit',
        },
        {
          x: lossData.map((_, index) => index),
          y: lossData,
          fill: 'tozeroy',
          type: 'scatter',
          mode: 'lines',
          line: { color: 'red' },
          name: 'Loss',
        },
      ];
    }
    console.log("R: ", res)
    return res;
  };

  return (
    <div className="p-4 space-y-4">
      {/* Summary Statistics */}
      <div>
        <Card>
          <Card.Body className="pt-6">
            <div>
              <div>
                <p>Total Profit/Loss</p>
                <h3 className={`text-2xl font-bold ${metrics.total_profit - metrics.total_loss >= 0 ? 'text-success' : 'text-danger'}`}>
                  {(metrics.total_profit - metrics.total_loss).toFixed(2)}
                </h3>
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Win Rate</p>
                <h3 className="text-2xl font-bold text-blue-600 text-success">{winRate}%</h3>
              </div>
              <PieChart className="w-8 h-8 text-blue-600" />
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Max Drawdown</p>
                <h3 className="text-2xl font-bold text-danger">{metrics.max_drawdown.toFixed(2)}%</h3>
              </div>
              <TrendingDown className="w-8 h-8 text-danger" />
            </div>
          </Card.Body>
        </Card>
      </div>

      <Card className="p-4">
        <Tabs
              defaultActiveKey="equity"
              id="justify-tab-example"
              className="mb-3"
              justify
        >

          <Tab eventKey="equity" title="Equity Curve">
            <div className="h-96">
                <Plot
                  data={processChartData(metrics.equity)}
                  layout={{
                    title: 'Equity Chart (Daily Stock Prices)',
                    xaxis: {
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
            </div>
          </Tab>

          <Tab eventKey="pnl" title="PnL">
            <div className="h-96">
                <Plot
                  data={processChartData(metrics.pnl, true)}
                  layout={{
                    title: 'PnL Chart (Daily Stock Prices)',
                    xaxis: {
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
            </div>
          </Tab>

          <Tab eventKey="drawdown" title="Drawdown">
            <div className="h-96">
                <Plot
                  data={processChartData(metrics.drawdown)}
                  layout={{
                    title: 'Drawdown Chart (Daily Stock Prices)',
                    xaxis: {
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
            </div>
          </Tab>
        </Tabs>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <Card.Header>
            <Card.Title>Trading Statistics</Card.Title  >
          </Card.Header>
          <Card.Body>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Trades:</span>
                <span className="font-bold">{metrics.no_of_trades}</span>
              </div>
              <div className="flex justify-between">
                <span>Winning Trades:</span>
                <span className="font-bold text-success">{metrics.winning_trades}</span>
              </div>
              <div className="flex justify-between">
                <span>Losing Trades:</span>
                <span className="font-bold text-danger">{metrics.total_losing_trades}</span>
              </div>
              <div className="flex justify-between">
                <span>Max Consecutive Wins:</span>
                <span className="font-bold text-success">{metrics.max_cons_win}</span>
              </div>
              <div className="flex justify-between">
                <span>Max Consecutive Losses:</span>
                <span className="font-bold text-danger">{metrics.max_cons_loss}</span>
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>Current Position</Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="space-y-2">
              {/*<div className="flex justify-between">
                <span>Open Trades:</span>
                <span className="font-bold">{metrics.open_trades}</span>
              </div>*/}
              <div className="flex justify-between">
                <span>Max Equity:</span>
                <span className="font-bold text-success">${metrics.max_equity.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Max Unrealized Equity:</span>
                <span className="font-bold">${metrics.max_unrealised_equity.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Max Unrealized Drawdown:</span>
                <span className="font-bold text-danger">{metrics.max_unrealised_drawdown.toFixed(2)}%</span>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>

      <Card>
        <Card.Header>
          <Card.Title>Recent Orders</Card.Title>
        </Card.Header>
        <Card.Body>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Order ID</th>
                  <th className="text-left p-2">Type</th>
                  <th className="text-left p-2">Price</th>
                  <th className="text-left p-2">Quantity</th>
                  <th className="text-left p-2">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {metrics.orders.slice(-5).map((order) => (
                  <tr key={order.order_id} className="border-b">
                    <td className="p-2">{order.order_id}</td>
                    <td className={`p-2 ${order.order_type === 'buy' ? 'text-success' : 'text-danger'}`}>
                      {order.order_type.toUpperCase()}
                    </td>
                    <td className="p-2">${order.price.toFixed(2)}</td>
                    <td className="p-2">{order.quantity}</td>
                    <td className="p-2">{formatDate(order.timestamp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default TradingDashboard;
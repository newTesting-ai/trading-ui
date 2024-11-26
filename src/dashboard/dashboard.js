import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Activity, PieChart, AlertCircle } from 'lucide-react';
import { useParams } from 'react-router-dom';

import Plot from 'react-plotly.js';
import stocks from '../data/stocks_nse'
import bb from '../data/bollinger_bands'

const TradingDashboard = () => {
  const [isStockCollapsed, setStockCollapsed] = useState(false);
  const [isIntervalCollapsed, setIntervalCollapsed] = useState(false);
  const [isFromDateCollapsed, setFromDateCollapsed] = useState(false);
  const [isToDateCollapsed, setToDateCollapsed] = useState(false);
  const { code } = useParams();
  const [metricData, setMetricData] = useState(null);
  const [stock, setStock] = useState("NSE_EQ|INE758T01015");
  const [interval, setInterval] = useState("day");
  const [fromDate, setFromDate] = useState("2023-01-01");
  const [toDate, setToDate] = useState("2024-09-09");
  const [winRate, setWinRate] = useState(0)
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const intervals = [
    {
        "name": "1 Minute",
        "symbol": "1minute"
    },
    {
        "name": "3 Minute",
        "symbol": "3minute"
    },
    {
        "name": "5 Minute",
        "symbol": "5minute"
    },
    {
        "name": "1 day",
        "symbol": "day"
    }
  ]
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/v2/backtesting/results?interval=${interval}&trade_id=${stock}&strategy=${code}`);
        if (!response.ok) {
          // Handle HTTP errors
          const errorData = await response.json();
          throw new Error(errorData.detail || "Something went wrong");
        }
        const result = await response.json();
        setMetricData(result); // Update state with fetched data
      } catch (error) {
        console.log(error)
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    setLoading(true);
    setError(null);
    fetchData();
  }, [stock, interval, fromDate, toDate]);

  const toggleStockDropdown = () => {
      setStockCollapsed(!isStockCollapsed);
  }


  const toggleIntervalDropdown = () => {
      setIntervalCollapsed(!isIntervalCollapsed);
  }

  const toggleFromDateDropdown = () => {
    setFromDateCollapsed(!isFromDateCollapsed);
  }


  const toggleToDateDropdown = () => {
      setToDateCollapsed(!isToDateCollapsed);
  }

  const updateStock = (e) => {
      setStock(e.target.id);
      toggleStockDropdown()
  }

  const updateInterval = (e) => {
      setInterval(e.target.id);
      toggleIntervalDropdown();
  }


  const updateFromDate = (e) => {
      setFromDate(e.target.id);
      toggleFromDateDropdown()
  }

  const updateToDate = (e) => {
      setToDate(e.target.id);
      toggleToDateDropdown();
  }


  useEffect(() => {
    // Calculate win rate after metricData has been updated
    if (metricData !== null && metricData.winning_trades && metricData.no_of_trades) {
      setWinRate((metricData.winning_trades / metricData.no_of_trades * 100).toFixed(2));
    }
  }, [metricData]);

  const [timeRange, setTimeRange] = useState('all');
  // Format timestamp to readable date
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString();
  };

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
    return res;
  };
  return (
    <div className="p-4 space-y-4">
       <div className="d-flex justify-content-center p-2">
            <h1>Strategy Metrics</h1>
       </div>
      {/* filters */}

      <div className="d-flex justify-content-center flex-column">
        <div className="d-flex justify-content-evenly flex-wrap">
            <div className="dropdown">
                <button className="btn btn-secondary dropdown-toggle" type="button" onClick={toggleStockDropdown}  data-bs-toggle="dropdown" aria-expanded="false">
                    Stocks
                </button>
                <ul className={`dropdown-menu ${isStockCollapsed ? `show` : ``}`}>
                    {stocks.filter((item) => item.instrument_type === "EQ").map((item, index) => (
                        <li className="dropdown-item" key={index} id={item.instrument_key} onClick={updateStock}>{item.name}</li>
                    ))}
                </ul>
            </div>
            <div className="dropdown">
                <button className="btn btn-secondary dropdown-toggle" type="button" onClick={toggleIntervalDropdown}  data-bs-toggle="dropdown" aria-expanded="false">
                    Interval
                </button>
                <ul className={`dropdown-menu ${isIntervalCollapsed ? `show` : ``}`}>
                    {intervals.map((item, index) => (
                        <li className="dropdown-item" key={index} id={item.symbol} onClick={updateInterval}>{item.name}</li>
                    ))}
                </ul>
            </div>
        </div>
        <p>Selected Filters: Interval: {interval}, Selected Stock: {stock}</p>
      </div>
      <div>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <div>
            <div className="d-flex justify-content-evenly flex-wrap">
              <Card className="p-4 flex-fill">
                <Card.Body className="pt-6">
                  <div>
                    <div>
                      <p>Total Profit/Loss</p>
                      <h3 className={`text-2xl font-bold ${metricData.total_profit - metricData.total_loss >= 0 ? 'text-success' : 'text-danger'}`}>
                        {(metricData.total_profit - metricData.total_loss).toFixed(2)}
                      </h3>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              <Card className="p-4 flex-fill">
                <Card.Body className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Win Rate</p>
                      <h3 className="text-2xl font-bold text-blue-600 text-success">
                    <PieChart className="w-8 h-8 text-blue-600" /> {winRate}%</h3>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              <Card className="p-4 flex-fill">
                <Card.Body className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Max Drawdown</p>
                      <h3 className="text-2xl font-bold text-danger">
                    <TrendingDown className="w-8 h-8 text-danger" /> {metricData.max_drawdown.toFixed(2)}%</h3>
                    </div>
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
                        data={processChartData(metricData.equity)}
                        layout={{
                          title: 'Equity Chart (Daily Stock Prices)',
                          xaxis: {
                  //          rangeslider: { visible: true },            // Adds a range slider for zooming and panning
                            fixedrange: false,
                          },
                          yaxis: {
                            title: 'Capital',
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
                        data={processChartData(metricData.pnl, true)}
                        layout={{
                          title: 'PnL Chart (Daily Stock Prices)',
                          xaxis: {
                  //          rangeslider: { visible: true },            // Adds a range slider for zooming and panning
                            fixedrange: false,
                          },
                          yaxis: {
                            title: 'Amount',
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
                        data={processChartData(metricData.drawdown)}
                        layout={{
                          title: 'Drawdown Chart (Daily Stock Prices)',
                          xaxis: {
                  //          rangeslider: { visible: true },            // Adds a range slider for zooming and panning
                            fixedrange: false,
                          },
                          yaxis: {
                            title: 'Percent',
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

            <div className="d-flex justify-content-evenly flex-wrap">
              <Card className="p-4 flex-fill">
                <Card.Header>
                  <Card.Title>Trading Statistics</Card.Title  >
                </Card.Header>
                <Card.Body>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Trades:</span>
                      <span className="font-bold">{metricData.no_of_trades}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Winning Trades:</span>
                      <span className="font-bold text-success">{metricData.winning_trades}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Losing Trades:</span>
                      <span className="font-bold text-danger">{metricData.total_losing_trades}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Max Consecutive Wins:</span>
                      <span className="font-bold text-success">{metricData.max_cons_win}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Max Consecutive Losses:</span>
                      <span className="font-bold text-danger">{metricData.max_cons_loss}</span>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              <Card className="p-4  flex-fill">
                <Card.Header>
                  <Card.Title>Current Position</Card.Title>
                </Card.Header>
                <Card.Body>
                  <div className="space-y-2">
                    {/*<div className="flex justify-between">
                      <span>Open Trades:</span>
                      <span className="font-bold">{metricData.open_trades}</span>
                    </div>*/}
                    <div className="flex justify-between">
                      <span>Max Equity:</span>
                      <span className="font-bold text-success">${metricData.max_equity.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Max Unrealized Equity:</span>
                      <span className="font-bold">${metricData.max_unrealised_equity.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Max Unrealized Drawdown:</span>
                      <span className="font-bold text-danger">{metricData.max_unrealised_drawdown.toFixed(2)}%</span>
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
                      {metricData.orders.slice(-5).map((order) => (
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
        )}
      </div>
    </div>
  );
};

export default TradingDashboard;
import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Plot from 'react-plotly.js';
import metrics from '../data/metrics'
import bb from '../data/bollinger_bands'
import strategies from '../data/strategies'

const Performance = () => {
    const [selectedSeries, setSelectedSeriesTypes] = useState({
        SMA: false,
        DEFAULT: false,
        BB: false,
        // Add other data types as needed
    });
    // Example data structure
    const dataSeries = {
        equity: {
            DEFAULT: metrics.equity,
            BB: bb.equity,
            SMA: bb.equity  // New data point added here
        },
        drawdown: {
            DEFAULT: metrics.drawdown,
            BB: bb.drawdown,
            SMA: bb.drawdown // New data point added here
        }
    };

    // Configuration for series properties
    const chartSeriesConfig = {
        equity: [
            { key: 'DEFAULT', color: 'red', name: 'Buy/Sell alternatively' },
            { key: 'BB', color: 'green', name: 'Bollinger Band' },
            { key: 'SMA', color: 'purple', name: 'Equity SMA' } // New SMA series config
        ],
        drawdown: [
            { key: 'DEFAULT', color: 'blue', name: 'Buy/Sell alternatively' },
            { key: 'BB', color: 'orange', name: 'Bollinger Band' },
            { key: 'SMA', color: 'purple', name: 'SMA' } // New SMA series config
        ]
    };
    const handleCheckboxChange = (event) => {
        const type = event.target.id
        setSelectedSeriesTypes(prevState => ({
            ...prevState,
            [type]: event.target.checked,
        }));
        console.log(selectedSeries)
    };

    // Process chart data based on type and drawdown status
    const processChartData = (type) => {
        const seriesConfig = chartSeriesConfig[type];
        const chartData = [];

        seriesConfig.forEach(series => {
            if (selectedSeries[series.key]) { // Only include if selected
                const seriesData = dataSeries[type][series.key]; // Dynamic access to data series
                chartData.push({
                    type: 'scatter',
                    mode: 'lines',
                    line: { color: series.color },
                    name: series.name,
                    x: seriesData.map((_, index) => index),
                    y: seriesData.map(item => item.value)
                });
            }
        });

        return chartData;
    };

    const equityChartData = processChartData("equity");

    return (
        <div className="p-4 space-y-4">
            <div className="d-flex justify-content-center p-2">
                <h1>Strategy Performance Comparison</h1>
            </div>
            <div class="btn-group" role="group" aria-label="Basic checkbox toggle button group">
                {strategies.strategies.slice(0, 5).map((item, index) => (
                    <div key={index}>
                        <input type="checkbox" class="btn-check" onClick={handleCheckboxChange} id={item.code} autocomplete="off" />
                        <label className="btn btn-outline-primary" for={item.code}>{item.name}</label>
                    </div>
                ))}
            </div>
            {/* Summary Statistics */}
            <div className="d-flex justify-content-evenly flex-wrap">
                {/* <Card className="p-4 flex-fill">
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
        </Card> */}

                {/* <Card className="p-4 flex-fill">
          <Card.Body className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Win Rate</p>
                <h3 className="text-2xl font-bold text-blue-600 text-success">
              <PieChart className="w-8 h-8 text-blue-600" /> {winRate}%</h3>
              </div>
            </div>
          </Card.Body>
        </Card> */}

                {/* <Card className="p-4 flex-fill">
          <Card.Body className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Max Drawdown</p>
                <h3 className="text-2xl font-bold text-danger">
              <TrendingDown className="w-8 h-8 text-danger" /> {metricData.max_drawdown.toFixed(2)}%</h3>
              </div>
            </div>
          </Card.Body>
        </Card> */}
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
                                data={equityChartData}
                                layout={{
                                    title: 'Equity Chart',
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

                    {/* <Tab eventKey="pnl" title="PnL">
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
          </Tab> */}

                    <Tab eventKey="drawdown" title="Drawdown">
                        <div className="h-96">
                            <Plot
                                data={processChartData("drawdown")}
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

            {/* <div className="d-flex justify-content-evenly flex-wrap">
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
              </div>
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
      </div> */}
        </div>
    );
};

export default Performance;
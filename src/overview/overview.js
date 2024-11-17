import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';

import { Link } from 'react-router-dom';
import strategies from '../data/strategies'
import StockChart from '../charts/StockChart';
import stockData from '../data/stockData'

const Overview = () => {
    const data = {
        initialCapital: 100000,
        openPositions: 8,
        orders: [
            {
                symbol: {
                    name: "AAPL",
                    img: "",
                },
                type: "long",
                quantitiy: 121,
                entryPrice: 123.12,
                currentPrice: 165.21
            },
            {
                symbol: {
                    name: "MSFT",
                    img: "",
                },
                type: "long",
                quantitiy: 121,
                entryPrice: 223.12,
                currentPrice: 125.1
            }
        ]
    }
    const openPositions = data.orders.length;
    let pnl = data.orders.reduce((sum, obj) => sum + (obj.currentPrice - obj.entryPrice) * obj.quantitiy, 0);
    let pnlPercentage = pnl / data.initialCapital;
    pnl = Number(pnl.toFixed(5));
    pnlPercentage = Number(pnlPercentage.toFixed(4)) * 100;
    let up;
    if (pnl > 0) {
        up = true;
    } else {
        up = false;
    }
    const buyingPower = data.initialCapital - data.orders.reduce((sum, obj) => sum + obj.entryPrice * obj.quantitiy, 0);
    const [selectedIndicators, setSelectedIndicators] = useState([]);


    const handleIndicatorChange = (event) => {
      const { value, checked } = event.target;
       setSelectedIndicators(prevIndicators => {
      // Only add if checked and not already in the list, otherwise remove
      if (!prevIndicators.includes(value)) {
        return [...prevIndicators, value];
      } else if (prevIndicators.includes(value)) {
        return prevIndicators.filter(indicator => indicator !== value);
      }
      return prevIndicators;
    });
    };
    return (

        <div className="p-4 space-y-4">
            <div className="d-flex justify-content-center p-2">
                <h1>Overview</h1>
            </div>
            {/* Summary Statistics */}
            <div className='container'>
                <div className="row">
                    <div className="col-3">
                        <Card className="p-2">
                            <Card.Body className="pt-6">
                                <div>
                                    <p>Portfolio Value</p>
                                    <p> <b>{data.initialCapital + pnl}</b></p>
                                    <p className={`text-2xl font-bold ${up ? 'text-success' : 'text-danger'}`}> {up ? `+${pnlPercentage}%` : `${pnlPercentage}%`} today</p>
                                </div>
                            </Card.Body>
                        </Card>
                        <Card className="p-2">
                            <Card.Body className="pt-6">
                                <Card.Title>Open Positions</Card.Title>
                                <div>
                                    <p> {openPositions}</p>
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                    <div className='col-6'>
                        <label htmlFor="indicators">Select Indicator: </label>
                        <select id="indicators" value={selectedIndicators} onChange={handleIndicatorChange}>
                            <option value="">None</option>
                            <option value="sma">Simple Moving Average (SMA)</option>
                            <option value="ema">Exponential Moving Average (EMA)</option>
                            <option value="rsi">Relative Strength Index (RSI)</option>
                            <option value="candle">CandleSticks</option>
                        </select>
                        <StockChart priceData={stockData}  indicators={selectedIndicators}  />
                    </div>
                    <Card className="col-3 p-2">
                        <Card.Body className="pt-6">
                            <Card.Title>Active Orders</Card.Title>
                            <div>
                                {data.orders.splice(-3).map((item, index) => (
                                    <Card >
                                        <Card.Body>
                                            <p>{item.symbol.name}</p>
                                        </Card.Body>
                                    </Card>
                                ))}
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </div>
            <Card>
                <Card.Body>
                    <div className="overflow-x-auto table-responsive">
                        <table className="table table-striped table-hover">
                            <caption>Active Strategies</caption>
                            <thead>
                                <tr className="table-primary">
                                    <th scope="col">#</th>
                                    <th scope="col">Strategy Name</th>
                                    <th scope="col">Profit/Loss</th>
                                    <th scope='col'>Win Rate %</th>
                                    <th scope="col">Active</th>
                                    <th scope="col">Backtesting Results</th>
                                </tr>
                            </thead>
                            <tbody className='table-group-divider'>
                                {strategies["strategies"].map((item, index) => (
                                    <tr key={index}>
                                        <td>{index}</td>
                                        <td>{item.name}</td>
                                        <td>{item.pnl}</td>
                                        <td>{item.win}%</td>
                                        <td className={item.active ? `m-1 badge badge-pill bg-success text-light` : `m-1 badge badge-pill bg-danger text-light`}>{item.active ? "Active": "Paused"}</td>
                                        <td><Link key={index} to={`/strategies/result/${item.code}`}>Results</Link></td>
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

export default Overview;
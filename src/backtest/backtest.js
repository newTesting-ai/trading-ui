import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Plot from 'react-plotly.js';
import metrics from '../data/metrics'
import bb from '../data/bollinger_bands'
import strategies from '../data/strategies'

const Backtest = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isStrategyCollapsed, setIsStrategy] = useState(false);
    const [stock, setStock] = useState(null);
    const [strategy, setStrategy] = useState(null);
    const stocks = [
        {
            "name": "Tata Consultancy Service",
            "symbol": "TCS"
        },
        {
            "name": "Mahindra",
            "symbol": "MH"
        },
        {
            "name": "Apple",
            "symbol": "AAPL"
        }
    ]

    const toggleDropdown = () => {
        setIsCollapsed(!isCollapsed);
    }


    const toggleStrategyDropdown = () => {
        setIsStrategy(!isStrategyCollapsed);
    }

    const updateStock = (e) => {
        setStock(e.target.id);
        toggleDropdown()
    }

    const updateStrategy = (e) => {
        setStrategy(e.target.id);
        toggleStrategyDropdown();
    }

    const runBacktest = () => {
        console.log(stock, strategy);
    }
    return (
        <div className="p-4 space-y-4">
            <div className="d-flex justify-content-center p-2">
                <h1>Strategy Backtesting Dashboard</h1>
            </div>
            {/* Summary Statistics */}
            <div className="d-flex justify-content-center flex-column">
                <div className="d-flex justify-content-evenly flex-wrap">
                    <div className="dropdown">
                        <button className="btn btn-secondary dropdown-toggle" type="button" onClick={toggleDropdown}  data-bs-toggle="dropdown" aria-expanded="false">
                            Stocks
                        </button>
                        <ul className={`dropdown-menu ${isCollapsed ? `show` : ``}`}>
                            {stocks.map((item, index) => (
                                <li className="dropdown-item" key={index} id={item.symbol} onClick={updateStock}>{item.name}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="dropdown">
                        <button className="btn btn-secondary dropdown-toggle" type="button" onClick={toggleStrategyDropdown}  data-bs-toggle="dropdown" aria-expanded="false">
                            Strategy
                        </button>
                        <ul className={`dropdown-menu ${isStrategyCollapsed ? `show` : ``}`}>
                            {strategies.strategies.map((item, index) => (
                                <li className="dropdown-item" key={index} id={item.code} onClick={updateStrategy}>{item.name}</li>
                            ))}
                        </ul>
                    </div>
                    <button className="btn btn-primary" type="button" onClick={runBacktest} aria-expanded="false">
                        Run Backtest
                    </button>
                </div>
                <p>Selected Strategy: {strategy}, Selected Stock: {stock}</p>
            </div>
        </div>
    );
};

export default Backtest;
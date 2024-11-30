import React, { useEffect, useState } from 'react';
// import strategies from '../data/strategies'
import stocks from '../data/stocks_nse'
import intervals from '../data/intervals'

const Backtest = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isIntervalCollapsed, setIntervalCollapsed] = useState(false);
    const [interval, setInterval] = useState("day");
    const [isStrategyCollapsed, setIsStrategy] = useState(false);
    const [stock, setStock] = useState("NSE_EQ|INE758T01015");
    const [strategy, setStrategy] = useState(null);
    const [error, setError] = useState(null);
    const [sent, setSent] = useState(false);
    const [strategies, setStrategies] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchStrategies = async () => {
        try {
          const response = await fetch("http://localhost:8000/api/v2/backtesting/strategies");
          if (!response.ok) {
            throw new Error("Failed to fetch strategies");
          }
          const data = await response.json();
          setStrategies(data || []); // Assuming the API returns an object with a "strategies" array
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchStrategies();
    }, []);
  
    if (loading) {
      return <div>Loading...</div>;
    }
  
    if (error) {
      return <div>Error: {error}</div>;
    }
  
    const toggleDropdown = () => {
        setIsCollapsed(!isCollapsed);
    }


    const toggleStrategyDropdown = () => {
        setIsStrategy(!isStrategyCollapsed);
    }
    const toggleIntervalDropdown = () => {
        setIntervalCollapsed(!isIntervalCollapsed);
    }

    const updateStock = (e) => {
        setStock(e.target.id);
        toggleDropdown()
    }

    const updateStrategy = (e) => {
        setStrategy(e.target.id);
        toggleStrategyDropdown();
    }

    const updateInterval = (e) => {
        setInterval(e.target.id);
        toggleIntervalDropdown();
    }

    const runBacktest = async() => {
        console.log(stock, strategy, interval);
        try {
            // Make the API request and ignore the result
            setSent(true)
            await fetch(`http://localhost:8000/api/v2/backtesting?interval=${interval}&trade_id=${stock}&strategy=${strategy}`, {
              method: "GET", // Change method if needed
              headers: { "Content-Type": "application/json" }
            });
            console.log("API request sent successfully");
          } catch (error) {
            console.error("Error sending API request:", error);
            setError(error)
        }
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
                            {stocks.filter((item) => item.instrument_type === "EQ").map((item, index) => (
                                <li className="dropdown-item" key={index} id={item.instrument_key} onClick={updateStock}>{item.name}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="dropdown">
                        <button className="btn btn-secondary dropdown-toggle" type="button" onClick={toggleStrategyDropdown}  data-bs-toggle="dropdown" aria-expanded="false">
                            Strategy
                        </button>
                        <ul className={`dropdown-menu ${isStrategyCollapsed ? `show` : ``}`}>
                            {strategies.map((item, index) => (
                                <li className="dropdown-item" key={index} id={item.code} onClick={updateStrategy}>{item.name}</li>
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
                    <button className="btn btn-primary" type="button" onClick={runBacktest} aria-expanded="false">
                        Run Backtest
                    </button>
                </div>
                <p>Selected Strategy: {strategy}, Selected Stock: {stock}</p>
                <div>
                    {sent ? (
                        <p>Backtesting in progress Please check in few time.</p>
                        ) : error ? (
                        <p>Error: {error}</p>
                    ) : (
                        <p></p>
                    )}
                </div>
                
            </div>
        </div>
    );
};

export default Backtest;
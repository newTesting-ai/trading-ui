import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Activity, PieChart, AlertCircle } from 'lucide-react';
import stocks from '../data/stocks_nse'

import { Link } from 'react-router-dom';
// import strategies from '../data/strategies'

const Trading = () => {
  const [strategies, setStrategies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isStrategyCollapsed, setIsStrategy] = useState(false);
  const [stock, setStock] = useState("NSE_EQ|INE758T01015");
  const [strategy, setStrategy] = useState(null);
  const [error, setError] = useState(null);
  const [sent, setSent] = useState(false);
  const [tradingStrategies, setTradingStrategies] = useState([]);
  const fetchTradingStrategies = async () => {
    try {
    const response = await fetch("http://localhost:4000/api/v1/trading/strategies");
    if (!response.ok) {
        throw new Error("Failed to fetch strategies");
    }
    const data = await response.json();
    setTradingStrategies(data || []); // Assuming the API returns an object with a "strategies" array
    } catch (err) {
    setError(err.message);
    } finally {
    setLoading(false);
    }
};
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
    
    fetchTradingStrategies();

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
  const updateStock = (e) => {
      setStock(e.target.id);
      toggleDropdown()
  }

  const updateStrategy = (e) => {
      setStrategy(e.target.id);
      toggleStrategyDropdown();
  }


  const runTrading = async() => {
      console.log(stock, strategy);          
      try {
        setSent(true)
        const response = await fetch(`http://localhost:4000/add_symbol?symbol=${stock}`, {
          method: 'POST',
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json(); // Assuming the API returns a JSON response
        console.log('Symbol added:', data);

        fetchTradingStrategies();
      } catch (error) {
          setError(error)
          console.error('Error adding symbol:', error);
      }
  }
  const stopTrading = async(symbol) => {
    console.log(stock, strategy);          
    try {
      setSent(true)
      const response = await fetch(`http://localhost:4000/remove_symbol?symbol=${symbol}`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json(); // Assuming the API returns a JSON response
      console.log('Symbol added:', data);

      fetchTradingStrategies();
    } catch (error) {
        setError(error)
        console.error('Error adding symbol:', error);
    }
}
  return (
      <div className="p-4 space-y-4">
          <div className="d-flex justify-content-center p-2">
              <h1>Trading Dashboard</h1>
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
                  <button className="btn btn-primary" type="button" onClick={runTrading} aria-expanded="false">
                      Start Trading
                  </button>
              </div>
              <p>Selected Strategy: {strategy}, Selected Stock: {stock}</p>
              <div>
                  {sent ? (
                      <p>Trading Started. Please check Position tab</p>
                      ) : error ? (
                      <p>Error: {error}</p>
                  ) : (
                      <p></p>
                  )}
              </div>
              
          </div>
          <table className="table m-4">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Strategy Name</th>
          <th scope="col">Code</th>
          <th scope="col">Symbol</th>
          <th scope="col">Performance</th>
          <th scope='col'>Stop Trading?</th>
        </tr>
      </thead>
      <tbody>
        {tradingStrategies.map((item, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{item.name}</td>
            <td>{item.code}</td>
            <td>{item.symbol}</td>
            <td>TBD</td>
            <td><b><i><span onClick={(e) => stopTrading(item.symbol)}>STOP</span></i></b></td>
          </tr>
        ))}
      </tbody>
    </table>
      </div>
  );
  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
};


export default Trading;
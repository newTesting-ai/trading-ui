import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Activity, PieChart, AlertCircle } from 'lucide-react';

import { Link } from 'react-router-dom';
// import strategies from '../data/strategies'

const Strategy = () => {
  const [strategies, setStrategies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <table className="table m-4">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Strategy Name</th>
          <th scope="col">Code</th>
          <th scope="col">Active</th>
          <th scope="col">Backtesting Results</th>
        </tr>
      </thead>
      <tbody>
        {strategies.map((item, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{item.name}</td>
            <td>{item.code}</td>
            <td>{item.active ? "Yes" : "No"}</td>
            <td>
              <Link to={`/strategies/result/${item.code}`}>Results</Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};


export default Strategy;
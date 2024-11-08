import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Activity, PieChart, AlertCircle } from 'lucide-react';

import { Link } from 'react-router-dom';
import strategies from '../data/strategies'

const Strategy = () => {
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
        {strategies["strategies"].map((item, index) => (
            <tr key={index}>
                <td>{index}</td>
                <td>{item.name}</td>
                <td>{item.code}</td>
                <td>{item.active ? "Yes" : "No"}</td>
                <td><Link key={index} to={`/strategies/result/${item.code}`}>Results</Link></td>
            </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Strategy;
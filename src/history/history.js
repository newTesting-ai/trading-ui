import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Activity, PieChart, AlertCircle } from 'lucide-react';

import { Link } from 'react-router-dom';
import metrics from '../data/metrics'

const TradeHistory = () => {

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    
    <table className="table m-4">
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
      {metrics.orders.splice(-20).map((order) => (
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
  );
};

export default TradeHistory;
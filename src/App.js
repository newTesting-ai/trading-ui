// import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';

// import StockChart from './charts/StockChart';
// import stockData from './data'
// const App = () => {
//   const [selectedIndicators, setSelectedIndicators] = useState([]);


//  const handleIndicatorChange = (event) => {
//    const { value, checked } = event.target;
//     setSelectedIndicators(prevIndicators => {
//    // Only add if checked and not already in the list, otherwise remove
//    if (!prevIndicators.includes(value)) {
//      return [...prevIndicators, value];
//    } else if (prevIndicators.includes(value)) {
//      return prevIndicators.filter(indicator => indicator !== value);
//    }
//    return prevIndicators;
//  });
//  };

  
// };

// export default App;
import React, {useState} from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation, Outlet } from 'react-router-dom';
import { Activity, Settings, AlertCircle, BookOpen, TrendingUp, History, BarChart2, LineChart, Building } from 'lucide-react';
import TradingDashboard from './dashboard/dashboard'
import Strategy from './strategies/strategy'
import TradeHistory from './history/history'
import Performance from './performance/performance'
import Position from './positions/position'
import Overview from './overview/overview'
import Backtest from './backtest/backtest'
import StrategyBuilder from './createStrategy/createStrategy'

// Layout Component
const DashboardLayout = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const navItems = [
    { path: '/', label: 'Overview', icon: LineChart },
    { path: '/positions', label: 'Positions', icon: TrendingUp },
    { path: '/performance', label: 'Performance', icon: BarChart2 },
    { path: '/strategies', label: 'Strategies', icon: BookOpen },
    { path: '/backtest', label: 'Backtest', icon: BookOpen },
    { path: '/builder', label: 'Builder', icon: Building },
    { path: '/monitoring', label: 'Monitoring', icon: Activity },
    { path: '/history', label: 'History', icon: History },
    { path: '/alerts', label: 'Alerts', icon: AlertCircle },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  const toggleNav = () => {
    setIsCollapsed(!isCollapsed);
  }

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <nav className="navbar navbar-expand-lg navbar-light bg-light p-3">
        <a className="navbar-brand" href="/">AlgoTrading</a>
        <button className="navbar-toggler" type="button" onClick={toggleNav} data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={isCollapsed ? `collapse` : `` + ` navbar-collapse`} id="navbarNav">
          <ul className="navbar-nav">
            {navItems.map(({ path, label, icon: Icon }) => (
              <li><Link
                key={path}
                to={path}
                className={`flex items-center px-3 py-4 text-sm font-medium ${
                  location.pathname === path
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </Link></li>
            ))}
          </ul>
        </div>
      </nav>

      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};

// Page Components (placeholders)
const Alerts = () => <div>Alerts & Notifications will be available in next update.</div>;
const Monitoring = () => <div>Monitoring will be available in next update.</div>

// Main App with Routes
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="positions" element={<Position />} />
          <Route path="performance" element={<Performance />} />
          <Route path="strategies" element={<Strategy />} />
          <Route path="backtest" element={<Backtest />} />
          <Route path="monitoring" element={<Monitoring />} />
          <Route path="history" element={<TradeHistory />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="settings" element={<Settings />} />
          <Route path="builder" element={<StrategyBuilder />} />
          <Route path="/strategies/result/:code" element={<TradingDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
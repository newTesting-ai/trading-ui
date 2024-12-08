import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import { useSubscription, gql } from '@apollo/client';

const PORTFOLIO_SUBSCRIPTION = gql`
  subscription {
    portfolioUpdate {
      initialCapital
      capital
      openPositions
      orders {
        symbol {
            name
        }
        type
        quantity
        entryPrice
        currentPrice
      }
    }
  }
`;

const Position = () => {
    const [selectedIndicators, setSelectedIndicators] = useState([]);
    const { data, loading, error } = useSubscription(PORTFOLIO_SUBSCRIPTION, {
        fetchPolicy: 'no-cache', // Disable caching to avoid data stale issues
        onData: (subscriptionData) => {
          console.log('Received Data:', subscriptionData.data);
        },
      });
    console.log(data, loading, error)
    if (loading || data === undefined) return <p>Loading portfolio...</p>;
    if (error) return <p>Error: {error.message}</p>;
    const portfolioData = data.portfolioUpdate;
    const openPositions = portfolioData.orders.length;
    let pnl = portfolioData.orders.reduce((sum, obj) => sum + (obj.currentPrice - obj.entryPrice) * obj.quantity, 0);
    pnl = pnl + portfolioData.capital;
    let pnlPercentage = pnl / portfolioData.initialCapital;
    pnl = Number(pnl.toFixed(5));
    pnlPercentage = Number(pnlPercentage.toFixed(4)) * 100;
    let up;
    if (pnl > 0) {
        up = true;
    } else {
        up = false;
    }
    const buyingPower = portfolioData.capital;
    return (

        <div className="p-4 space-y-4">
            <div className="d-flex justify-content-center p-2">
                <h1>Trading Position</h1>
            </div>
            {/* Summary Statistics */}
            <div className="d-flex justify-content-center flex-wrap">
                <Card className="p-2 flex-fill">
                    <Card.Body className="pt-6">
                        <div>
                            <div>
                                <p>Portfolio Value</p>
                                <p> {portfolioData.initialCapital + pnl}</p>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
                <Card className="p-2 flex-fill">
                    <Card.Body className="pt-6">
                        <div>
                            <div>
                                <p>Today's Pnl</p>
                                <p className={`text-2xl font-bold ${up ? 'text-success' : 'text-danger'}`}> {up ? `+${pnl} (+${pnlPercentage}%)` : `${pnl} (${pnlPercentage}%)`}</p>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
                <Card className="p-2 flex-fill">
                    <Card.Body className="pt-6">
                        <div>
                            <div>
                                <p>Open Positions</p>
                                <p> {openPositions}</p>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
                <Card className="p-2 flex-fill">
                    <Card.Body className="pt-6">
                        <div>
                            <div>
                                <p>Buying Power</p>
                                <p>{buyingPower}</p>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </div>

            <Card>
                <Card.Body>
                    <div className="overflow-x-auto table-responsive">
                        <table className="table table-striped table-hover">
                            <caption>Open Positions</caption>
                            <thead>
                                <tr className="table-primary">
                                    <th className="p-2">Symbon</th>
                                    <th className="p-2">Type</th>
                                    <th className="p-2">Quantity</th>
                                    <th className="p-2">Entry Price</th>
                                    <th className="p-2">Current Price</th>
                                    <th className="p-2">Market Value</th>
                                    <th className="p-2">Unrealized P/L</th>
                                    <th className="p-2">P/L %</th>
                                </tr>
                            </thead>
                            <tbody className='table-group-divider'>
                                {portfolioData.orders.map((order) => (
                                    <tr key={order.order_id} className="border-b">
                                        <td className="p-2">{order.symbol.name}</td>
                                        <td className="p-2">{order.type}</td>
                                        <td className="p-2">{order.quantity}</td>
                                        <td className="p-2">${order.entryPrice.toFixed(2)}</td>
                                        <td className="p-2">${order.currentPrice.toFixed(2)}</td>
                                        <td className="p-2">${(order.currentPrice*order.quantity).toFixed(2)}</td>
                                        <td className={`p-2 ${(order.currentPrice-order.entryPrice) > 0 ? 'text-success' : 'text-danger'}`}>${((order.currentPrice-order.entryPrice)*order.quantity).toFixed(2)}</td>
                                        <td className={`p-2 ${(order.currentPrice-order.entryPrice) > 0 ? 'text-success' : 'text-danger'}`}>
                                            {((order.currentPrice-order.entryPrice)*100/order.entryPrice).toFixed(2)}
                                        </td>
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

export default Position;
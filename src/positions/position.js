import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';

const Position = () => {
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
                                <p> {data.initialCapital + pnl}</p>
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
                                {data.orders.map((order) => (
                                    <tr key={order.order_id} className="border-b">
                                        <td className="p-2">{order.symbol.name}</td>
                                        <td className="p-2">{order.type}</td>
                                        <td className="p-2">{order.quantity}</td>
                                        <td className="p-2">${order.entryPrice.toFixed(2)}</td>
                                        <td className="p-2">${order.currentPrice.toFixed(2)}</td>
                                        <td className="p-2">${(order.currentPrice*order.quantitiy).toFixed(2)}</td>
                                        <td className={`p-2 ${(order.currentPrice-order.entryPrice) > 0 ? 'text-success' : 'text-danger'}`}>${((order.currentPrice-order.entryPrice)*order.quantitiy).toFixed(2)}</td>
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
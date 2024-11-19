import React, { useState, useEffect } from "react";
import ConditionModal from "./conditionModal";

// The structure to represent the buy/sell conditions
const generateStrategyStructure = (buyConditions, sellConditions) => {
  return {
    id: Date.now(), // Unique ID based on current timestamp (you can adjust this to match your use case)
    name: `Strategy ${Date.now()}`,
    buyConditions: buyConditions,
    sellConditions: sellConditions,
    active: true,
  };
};

const StrategyBuilder = () => {
  const [strategies, setStrategies] = useState([]);
  const [activeStrategy, setActiveStrategy] = useState(null);
  const [buyConditions, setBuyConditions] = useState([]);
  const [sellConditions, setSellConditions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState(null); // "buy" or "sell"
  
  useEffect(() => {
    // Load saved strategies from localStorage (if any)
    const savedStrategies = JSON.parse(localStorage.getItem("strategies")) || [];
    setStrategies(savedStrategies);
  }, []);

  const createNewStrategy = () => {
    // Reset the conditions for a new strategy
    setBuyConditions([]);
    setSellConditions([]);
    setActiveStrategy({
      id: Date.now(), // Generate a new strategy ID
      name: `Strategy ${Date.now()}`,
      buyConditions: [],
      sellConditions: [],
      active: true,
    });
  };

  const addConditionToStrategy = (condition) => {
    if (!currentSection) return;

    if (currentSection === "buy") {
      setBuyConditions([...buyConditions, condition]);
    } else if (currentSection === "sell") {
      setSellConditions([...sellConditions, condition]);
    }

    setIsModalOpen(false);
  };

  const handleSaveStrategy = () => {
    const newStrategy = generateStrategyStructure(buyConditions, sellConditions);
    const updatedStrategies = [...strategies, newStrategy];

    setStrategies(updatedStrategies);
    localStorage.setItem("strategies", JSON.stringify(updatedStrategies)); // Save strategies to localStorage

    alert("Strategy saved successfully!");
  };

  const handleStartBacktest = () => {
    // Navigate to the backtest page
  };

  const loadStrategy = (strategyId) => {
    const strategy = strategies.find((strat) => strat.id === strategyId);
    if (strategy) {
      setActiveStrategy(strategy);
      setBuyConditions(strategy.buyConditions);
      setSellConditions(strategy.sellConditions);
    }
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <button onClick={createNewStrategy} style={styles.newStrategyButton}>
          New Strategy
        </button>
        <ul style={styles.strategyList}>
          {strategies.map((strategy) => (
            <li
              key={strategy.id}
              style={styles.strategyItem}
              onClick={() => loadStrategy(strategy.id)}
            >
              {strategy.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Area */}
      <div style={styles.main}>
        {activeStrategy ? (
          <>
            <h2>{activeStrategy.name}</h2>
            <div style={styles.strategySection}>
              <h3>Buy Conditions</h3>
              <ul>
                {buyConditions.map((condition, index) => (
                  <li key={index}>{condition.type}</li>
                ))}
              </ul>
              <button
                style={styles.addConditionButton}
                onClick={() => {
                  setCurrentSection("buy");
                  setIsModalOpen(true);
                }}
              >
                Add Condition
              </button>
            </div>

            <div style={styles.strategySection}>
              <h3>Sell Conditions</h3>
              <ul>
                {sellConditions.map((condition, index) => (
                  <li key={index}>{condition.type}</li>
                ))}
              </ul>
              <button
                style={styles.addConditionButton}
                onClick={() => {
                  setCurrentSection("sell");
                  setIsModalOpen(true);
                }}
              >
                Add Condition
              </button>
            </div>

            <div style={styles.actions}>
              <button onClick={handleSaveStrategy} style={styles.saveButton}>
                Save Strategy
              </button>
              <button
                onClick={handleStartBacktest}
                style={styles.backtestButton}
              >
                Start Backtest
              </button>
            </div>
          </>
        ) : (
          <p>Please select or create a strategy to start building.</p>
        )}
      </div>

      {/* Condition Modal */}
      {isModalOpen && (
        <ConditionModal
          onClose={() => setIsModalOpen(false)}
          onSave={addConditionToStrategy}
        />
      )}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    fontFamily: "Arial, sans-serif",
  },
  sidebar: {
    width: "250px",
    padding: "20px",
    backgroundColor: "#f4f4f4",
    borderRight: "1px solid #ccc",
  },
  newStrategyButton: {
    width: "100%",
    padding: "10px",
    marginBottom: "20px",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  strategyList: {
    listStyle: "none",
    padding: 0,
  },
  strategyItem: {
    padding: "10px",
    marginBottom: "5px",
    cursor: "pointer",
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  main: {
    flex: 1,
    padding: "20px",
  },
  strategySection: {
    marginBottom: "20px",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    backgroundColor: "#fff",
  },
  addConditionButton: {
    padding: "8px 12px",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  actions: {
    marginTop: "20px",
    display: "flex",
    gap: "20px",
  },
  saveButton: {
    padding: "10px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  backtestButton: {
    padding: "10px",
    backgroundColor: "#ffc107",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default StrategyBuilder;

import React, { useState, useEffect } from "react";

const conditionTypes = [
  { label: "SMA", value: "SMA" },
  { label: "Stop Loss", value: "Stop Loss" },
  { label: "Take Profit", value: "Take Profit" },
];

const ConditionModal = ({ onClose, onSave }) => {
  const [type, setType] = useState("");
  const [parameters, setParameters] = useState({});
  const [operator, setOperator] = useState("");
  const [valid, setValid] = useState(false);

  useEffect(() => {
    if (type === "SMA") {
      setParameters({ period: 14, threshold: 50 });
    } else if (type === "Stop Loss" || type === "Take Profit") {
      setParameters({ percentage: 1 });
    }
  }, [type]);

  const handleSave = () => {
    if (!type || !operator || !parameters) return;

    const condition = {
      type,
      parameters,
      operator,
    };

    onSave(condition);
  };

  const handleParameterChange = (e) => {
    const { name, value } = e.target;
    setParameters((prevParams) => ({
      ...prevParams,
      [name]: value,
    }));
  };

  const handleOperatorChange = (e) => {
    setOperator(e.target.value);
  };

  useEffect(() => {
    // Check if all required fields are set
    setValid(!!type && !!operator && Object.keys(parameters).length > 0);
  }, [type, operator, parameters]);

  return (
    <div style={styles.modal}>
      <div style={{display: "flex",justifyContent: "space-between"}}>
        <h2>Select Condition</h2>
        <b onClick={onClose} style={{cursor: "pointer"}}>X</b>
      </div>
      <div style={styles.formGroup}>
        <label>Condition Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={styles.input}
        >
          <option value="">Select Condition</option>
          {conditionTypes.map((condition) => (
            <option key={condition.value} value={condition.value}>
              {condition.label}
            </option>
          ))}
        </select>
      </div>

      {type && (
        <>
          <div style={styles.formGroup}>
            <label>Parameters</label>
            {type === "SMA" && (
              <>
                <div>
                  <label>Period</label>
                  <input
                    type="number"
                    name="period"
                    value={parameters.period}
                    onChange={handleParameterChange}
                    style={styles.input}
                  />
                </div>
                <div>
                  <label>Threshold</label>
                  <input
                    type="number"
                    name="threshold"
                    value={parameters.threshold}
                    onChange={handleParameterChange}
                    style={styles.input}
                  />
                </div>
              </>
            )}
            {(type === "Stop Loss" || type === "Take Profit") && (
              <div>
                <label>Percentage</label>
                <input
                  type="number"
                  name="percentage"
                  value={parameters.percentage}
                  onChange={handleParameterChange}
                  style={styles.input}
                />
              </div>
            )}
          </div>

          <div style={styles.formGroup}>
            <label>Operator</label>
            <select
              value={operator}
              onChange={handleOperatorChange}
              style={styles.input}
            >
              <option value="">Select Operator</option>
              <option value=">">&rt;</option>
              <option value="<">&lt;</option>
              <option value="==">=</option>
            </select>
          </div>

          <div style={styles.actions}>
            <button
              onClick={onClose}
              style={{ ...styles.button, backgroundColor: "#ccc" }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!valid}
              style={styles.button}
            >
              Save Condition
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  modal: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    width: "400px",
    zIndex: 1000,
  },
  formGroup: {
    marginBottom: "15px",
  },
  input: {
    width: "100%",
    padding: "8px",
    marginTop: "5px",
    border: "1px solid #ddd",
    borderRadius: "4px",
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
  },
  button: {
    padding: "10px 15px",
    border: "none",
    borderRadius: "4px",
    backgroundColor: "#007BFF",
    color: "#fff",
    cursor: "pointer",
  },
};

export default ConditionModal;

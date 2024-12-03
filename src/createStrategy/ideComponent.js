import Editor from "@monaco-editor/react";
import MonacoEditor from 'react-monaco-editor'
import React, { useState } from 'react'
import useWindowDimensions from '../util/dimension';
import './ide.css'

var typescript = `//Define TypeScript Interface
interface IPerson{
	name: String;
	age: Number;
	mobile: Number;
}

//TypeScript Interface can be used 
//to know what values a variable holds.
const Aman:IPerson = {
	name: "Aman",
	age: 23,
	mobile: 9874563215
}
`

var python = `
from typing import Tuple, Optional

class Strategy:
    def __init__(self, values):
        """
        Initialize the strategy with the provided values (historical data, configuration, etc.).
        
        :param values: Initial data to set up the strategy (could be historical data or configuration).
        """
        self.values = values  # Storing the values (like historical data or parameters)
    
    def update(self, new_data) -> None:
        """
        Update the strategy with new data (e.g., market data, prices).
        
        :param new_data: New data (price, volume, etc.) to update the strategy.
        :raises NotImplementedError: Should be implemented in a subclass.
        """
        raise NotImplementedError("Must implement the 'update' method.")
    
    def generate_signal(self) -> Tuple[str, Optional[float]]:
        """
        Generate a trading signal based on strategy logic.
        
        :returns: A tuple with a signal and price, e.g., ("buy", 105.50).
                 If no signal, return ("hold", None).
        :raises NotImplementedError: Should be implemented in a subclass.
        """
        raise NotImplementedError("Must implement 'generate_signal' method.")
`

var c = `#include <stdio.h>

int main()
{
	//Enter your code here
	return 0;
}
`

var cpp = `#include <iostream>
using namespace std;

int main()
{
	//Enter your code here
	return 0;
}
`

var ruby = `#Write Your Code here
`

var tempCode = {
	python: python,
	c: c,
	typescript: typescript,
	cpp: cpp,
	ruby: ruby
}

const IDE = () => {

	const { width, size, col } = useWindowDimensions();
	const [code, setCode] = useState(tempCode['python']);
	const [strategyName, setStrategyName] = useState("");
	const [strategyId, setStrategyId] = useState("");
	const [responseMessage, setResponseMessage] = useState("");
	const language = 'python'

	const onChange = (newValue, e) =>{
		setCode(newValue)
	}
	const handleSubmit = async (e) => {
		e.preventDefault();

		// Validate input fields
		if (!strategyName.trim() || !strategyId.trim()) {
			setResponseMessage("Error: Strategy Name and ID cannot be empty.");
			return;
		}

		var data = {
			strategy_name: strategyName,
			strategy_id: strategyId,
			strategy_code: code,
			user_id: "abcfsa232"
		}
		var options = {
			method: 'POST',
			headers: {
				'Content-type': 'application/json',
				Accept: 'application/json'
			},
			body: JSON.stringify(data)
		}
		try {
			// Send the request
			const res = await fetch(
				"http://localhost:8000/api/v1/strategy/save_strategy",
				options
			);
			const result = await res.json();

			// Handle response
			if (res.ok) {
				setResponseMessage(`Success: ${result.message}`);
			} else {
				setResponseMessage(`Error: ${result.detail || "Unknown error"}`);
			}
		} catch (error) {
			// Handle network or other errors
			console.log(error)
			setResponseMessage(`Error: ${error.message}`);
		}

	}

	const options = {
		selectOnLineNumbers: true,
		fontSize: { size },
		colorDecorators: true,
		inlineSuggest: true,
		formatOnType: true,
		autoClosingBrackets: true,
		minimap: { scale: 10 }
	};
	return (
		<>
			<div>
				<label>Strategy Name:</label>
				<input
					type="text"
					value={strategyName}
					onChange={(e) => setStrategyName(e.target.value)}
					placeholder="Enter strategy name"
					required
				/>
			</div>

			{/* Input for Strategy ID */}
			<div>
				<label>Strategy ID:</label>
				<input
					type="text"
					value={strategyId}
					onChange={(e) => setStrategyId(e.target.value)}
					placeholder="Enter strategy ID"
					required
				/>
			</div>
			<Editor
				width={`${width}px`}
				height="300px"
				defaultValue=''
				value={code}
				theme="vs-dark"
				options={options}
				language={language}
				onChange={onChange}
			/>

			<button onClick={handleSubmit}>Save Strategy</button>
			{responseMessage && (
                <div>
                    <p>{responseMessage}</p>
                </div>
            )}
		</>
	);
}
export default IDE;
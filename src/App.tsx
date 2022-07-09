import React from 'react';
import './App.css';
import PowerBIComponent from './PowerBIComponent/PowerBIComponent';

function App() {
	return (
		<div className="App">
			<header className="App-header">
				<PowerBIComponent reportURL={"https://app.powerbi.com/reportEmbed?reportId=c92cc55f-cf2f-4818-8bc4-037e38101090&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXdlc3QtdXMtcmVkaXJlY3QuYW5hbHlzaXMud2luZG93cy5uZXQvIn0%3D"} />
				<p>
					Example of PBI Report rendering
				</p>
			</header>
		</div>
	);
}

export default App;

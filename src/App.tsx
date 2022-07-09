import React, { useState, useRef } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import PowerBIComponent from './PowerBIComponent/PowerBIComponent';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
	const inputRef = useRef<HTMLInputElement>(null);
	const [reportURL, setReportURL] = useState<string>("https://app.powerbi.com/reportEmbed?reportId=c92cc55f-cf2f-4818-8bc4-037e38101090&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXdlc3QtdXMtcmVkaXJlY3QuYW5hbHlzaXMud2luZG93cy5uZXQvIn0%3D");

	const handleLoadEmbeddedReportClick = () => {
		if (inputRef && inputRef.current) {
			setReportURL(inputRef.current.value);
		}
	}

	return (
		<div className="App">
			<header className="App-header">
				<PowerBIComponent reportURL={reportURL} />
				<Container>
					<Row>
						<Col>
							<Form.Control ref={inputRef} type="text" defaultValue={reportURL} />
						</Col>
					</Row>
					<Row>
						<Col>
							<Button variant="primary" onClick={handleLoadEmbeddedReportClick}>Load PBI Report</Button>
						</Col>
					</Row>
				</Container>
			</header>
		</div>
	);
}

export default App;

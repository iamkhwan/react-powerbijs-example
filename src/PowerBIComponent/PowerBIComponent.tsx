import React, { useEffect, useRef } from "react"
import { Container, Row, Col } from 'react-bootstrap';
import PBIController from "../PowerBIController/PowerBIController";
import PowerBIServices from "../PowerBIService/PowerBIService";

interface PBIProps {
    reportURL: string;
}

export default function PowerBIComponent({ reportURL }: PBIProps) {

    const pbiContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const renderPBIReport = async () => {
            let result = await PBIController.checkPBIAccessToken();
            if (result) {
                if (pbiContainerRef && pbiContainerRef.current) {
                    await PBIController.renderPowerBIReport(pbiContainerRef.current, reportURL);
                }
            }
        };

        //To set the MSAL Config in constructor
        new PowerBIServices();

        //To render PBI report from report URL
        renderPBIReport();
        
    }, [reportURL]);

    return (
        <Container>
            <Row>
                <Col>
                    <div ref={pbiContainerRef} style={{ height: 600, width: "100%", paddingTop: 10, paddingBottom: 10 }}></div>
                </Col>
            </Row>
        </Container>
    );
}
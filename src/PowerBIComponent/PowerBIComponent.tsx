import React, { useEffect, useRef } from "react"
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

        new PowerBIServices();
        renderPBIReport();
    }, [reportURL]);

    return (
        <div ref={pbiContainerRef} style={{ height: 700, width: 1200 }}></div>
    );
}
import * as pbi from "powerbi-client";
import powerBIServices from "../PowerBIService/PowerBIService";

export default class PowerBIController {
    private static powerbi = new pbi.service.Service(
        pbi.factories.hpmFactory,
        pbi.factories.wpmpFactory,
        pbi.factories.routerFactory
    );

    public static async checkPBIAccessToken() {
        let pbiAccessToken = sessionStorage.getItem("pbiAccessToken");
        if (pbiAccessToken === undefined || pbiAccessToken === null) {
            return await powerBIServices
                .requestPBIAccessToken()
                .then((response) => {
                    if (response) {
                        sessionStorage.setItem(
                            "pbiAccessToken",
                            response.accessToken
                        );
                        sessionStorage.setItem(
                            "pbiAccessTokenExpired",
                            new Date(response.expiresOn).getTime().toString()
                        );
                        return true;
                    } else return false;
                });
        } else if (pbiAccessToken) {
            if (this.checkAccessTokenExpire()) {
                //Token's expired, it needs to request a new token
                return await powerBIServices
                    .requestPBIAccessToken()
                    .then((response) => {
                        if (response) {
                            sessionStorage.setItem(
                                "pbiAccessToken",
                                response.accessToken
                            );
                            sessionStorage.setItem(
                                "pbiAccessTokenExpired",
                                new Date(response.expiresOn)
                                    .getTime()
                                    .toString()
                            );
                            return true;
                        } else return false;
                    });
            } 
            else {
                //Token's still valid
                return true;
            }
        }
    }

    private static checkAccessTokenExpire(): boolean {
        if (sessionStorage.getItem("pbiAccessTokenExpired") !== undefined) {
            var pbiAccessTokenExpired = sessionStorage.getItem(
                "pbiAccessTokenExpired"
            );
            if (pbiAccessTokenExpired) {
                var expireDate = new Date(parseInt(pbiAccessTokenExpired));
                var currentDate = new Date();
                return currentDate >= expireDate;
            }
        }

        return true;
    }

    public static renderPowerBIReport(
        reportContainer: HTMLDivElement,
        reportURL: string
    ): Promise<boolean> {
        let reportType =
            reportURL.indexOf("reportId") > 0 ? "report" : "dashboard";
        let pbiAccessToken = sessionStorage.getItem("pbiAccessToken");
        let reportId = this.getReportIdfromURL(reportURL);
        let reportSection = this.getReportSectionfromURL(reportURL);

        let embedConfiguration = {
            type: reportType,
            accessToken: pbiAccessToken ? pbiAccessToken : "",
            id: reportId,
            tokenType: 0, //AAD Token Type = 0, Embed Token Type = 1
            embedUrl: reportURL,
            pageName: reportSection,
            settings: {
                filterPaneEnabled: true,
                navContentPaneEnabled: true,
            },
        };

        try {
            this.powerbi.embed(reportContainer, embedConfiguration);
            return Promise.resolve(true);
        } catch (e) {
            console.error(e);
            return Promise.resolve(false);
        }
    }

    private static getReportIdfromURL(url: string): string {
        var result: string = "";
        if (url) {
            var urlObj = new URL(url);
            var queryParams = new URLSearchParams(urlObj.search);
            var reportId = queryParams.get("reportId");
            var dashboardId = queryParams.get("dashboardId");
            result = reportId ? reportId : dashboardId ? dashboardId : "";
        }

        return result;
    }

    private static getReportSectionfromURL(url: string): string {
        var result: string = "";
        if (url) {
            var urlObj = new URL(url);
            var queryParams = new URLSearchParams(urlObj.search);
            var pageName = queryParams.get("pageName");
            result = pageName ? pageName : "";
        }

        return result;
    }
}

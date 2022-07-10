import {PublicClientApplication, Configuration} from "@azure/msal-browser";

export default class PowerBIService {
    private static authority = `${process.env.REACT_APP_AZURE_ACTIVE_DIRECTORY_APP_AAD_INSTANCE}/${process.env.REACT_APP_AZURE_ACTIVE_DIRECTORY_APP_TENANT_ID}`;
    private static clientId = `${process.env.REACT_APP_AZURE_ACTIVE_DIRECTORY_APP_CLIENT_ID}`;
    private static redirectUri = `${process.env.REACT_APP_AZURE_ACTIVE_DIRECTORY_REDIRECT_URL}`;

    private static msalConfig: Configuration;
    private static myMSALObj: PublicClientApplication;

    private static tokenRequest: any = {
        scopes: [
            "https://analysis.windows.net/powerbi/api/Report.Read.All",
            "https://analysis.windows.net/powerbi/api/Dataset.Read.All",
            "https://analysis.windows.net/powerbi/api/Dashboard.Read.All",
        ],
        account: null,
    };

    constructor() {
        PowerBIService.msalConfig = {
            auth: {
                authority: PowerBIService.authority,
                clientId: PowerBIService.clientId,
                redirectUri: PowerBIService.redirectUri,
            },
            cache: {
                cacheLocation: "localStorage",
                storeAuthStateInCookie: true,
            },
        };

        PowerBIService.myMSALObj = new PublicClientApplication(
            PowerBIService.msalConfig
        );
        PowerBIService.updateAccountToRequestObj();
    }

    private static updateAccountToRequestObj() {
        let allAcounts = PowerBIService.myMSALObj.getAllAccounts();
        if (allAcounts && allAcounts.length > 0) {
            PowerBIService.tokenRequest.account = allAcounts[0];
        }
    }

    public static requestPBIAccessToken(): Promise<any> {
        return PowerBIService.myMSALObj
            .acquireTokenSilent(PowerBIService.tokenRequest)
            .then((result: any) => {
                return result;
            })
            .catch((error: any) => {
                console.log("silent token acquisition fails. acquiring token using popup");
                console.log(error);

                return PowerBIService.myMSALObj
                    .acquireTokenPopup(PowerBIService.tokenRequest)
                    .then((tokenResponse) => {
                        PowerBIService.updateAccountToRequestObj();
                        return tokenResponse;
                    })
                    .catch((error2) => {
                        if (error2.errorCode === "popup_window_error") {
                            return false;
                        }
                        console.log(error2);
                    });
            });
    }
}

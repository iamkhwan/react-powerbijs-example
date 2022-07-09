import {PublicClientApplication, Configuration} from "@azure/msal-browser";

export default class PowerBIApi {
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
        PowerBIApi.msalConfig = {
            auth: {
                authority: PowerBIApi.authority,
                clientId: PowerBIApi.clientId,
                redirectUri: PowerBIApi.redirectUri,
            },
            cache: {
                cacheLocation: "localStorage",
                storeAuthStateInCookie: true,
            },
        };

        PowerBIApi.myMSALObj = new PublicClientApplication(
            PowerBIApi.msalConfig
        );
        PowerBIApi.updateAccountToRequestObj();
    }

    private static updateAccountToRequestObj() {
        let allAcounts = PowerBIApi.myMSALObj.getAllAccounts();
        if (allAcounts && allAcounts.length > 0) {
            PowerBIApi.tokenRequest.account = allAcounts[0];
        }
    }

    public static requestPBIAccessToken(): Promise<any> {
        return PowerBIApi.myMSALObj
            .acquireTokenSilent(PowerBIApi.tokenRequest)
            .then((result: any) => {
                return result;
            })
            .catch((error: any) => {
                console.log("silent token acquisition fails. acquiring token using popup");
                console.log(error);

                return PowerBIApi.myMSALObj
                    .acquireTokenPopup(PowerBIApi.tokenRequest)
                    .then((tokenResponse) => {
                        PowerBIApi.updateAccountToRequestObj();
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

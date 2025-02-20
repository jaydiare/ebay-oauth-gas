function getOAuth2Service() {
  return OAuth2.createService('eBay')
    .setTokenUrl('https://api.ebay.com/identity/v1/oauth2/token')
    .setClientId('YOUR_CLIENT_ID')  // Replace with your actual eBay Client ID
    .setClientSecret('YOUR_CLIENT_SECRET')  // Replace with your actual eBay Client Secret
    .setPropertyStore(PropertiesService.getScriptProperties()) // Stores tokens
    .setGrantType('refresh_token'); // Correct grant type
}

function refreshEbayToken() {
  var clientId = "YOUR_CLIENT_ID";  // Replace with your actual eBay Client ID
  var clientSecret = "YOUR_CLIENT_SECRET";  // Replace with your actual eBay Client Secret
  var refreshToken = PropertiesService.getScriptProperties().getProperty("EBAY_REFRESH_TOKEN");

  if (!refreshToken) {
    Logger.log("Error: No refresh token found. Ensure you store it first.");
    return;
  }

  var tokenUrl = "https://api.ebay.com/identity/v1/oauth2/token";

  var headers = {
    "Authorization": "Basic " + Utilities.base64Encode(clientId + ":" + clientSecret),
    "Content-Type": "application/x-www-form-urlencoded"
  };

  var payload = {
    "grant_type": "refresh_token",
    "refresh_token": refreshToken,
    "scope": "https://api.ebay.com/oauth/api_scope"
  };

  var options = {
    "method": "post",
    "headers": headers,
    "payload": payload,
    "muteHttpExceptions": true
  };

  try {
    var response = UrlFetchApp.fetch(tokenUrl, options);
    var jsonResponse = JSON.parse(response.getContentText());

    if (jsonResponse.access_token) {
      Logger.log("New Access Token: " + jsonResponse.access_token);
      PropertiesService.getScriptProperties().setProperty("EBAY_AUTH_TOKEN", jsonResponse.access_token);
    } else {
      Logger.log("Failed to refresh token: " + response.getContentText());
    }
  } catch (error) {
    Logger.log("Error refreshing token: " + error);
  }
}

function getEbayAccessToken() {
  return PropertiesService.getScriptProperties().getProperty("EBAY_AUTH_TOKEN");
}

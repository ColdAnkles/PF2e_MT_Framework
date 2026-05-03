
function display_hazard_stealth(hazardID) {
    let token = MapTool.tokens.getTokenByID(hazardID);

    let stealthData = JSON.parse(token.getProperty("stealth"));

    let returnString = "DC " + String(stealthData.dc) + " Perception ";

    cleanText = stealthData.details.replace(/<\/?[^>]+(>|$)/g, ""); //Clear HTML Code

    returnString += cleanText;

    return returnString;

}

MTScript.registerMacro("ca.pz2e.display_hazard_stealth", display_hazard_stealth);
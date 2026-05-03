[h:tokenName=macro.args]

[h: center=getViewCenter(0,";")]
[h: xCoord=getStrProp(center,"centerX")]
[h: yCoord=getStrProp(center,"centerY")]
[h: val = json.set("{}", "tokenImage", "lib://ca.pz2e/image/HazardDefault.png", "name", tokenName,"x",xCoord,"y",yCoord)]
[h: newToken = createToken(val)]
[h: setPropertyType("PZ2E_Hazard", newToken)]

[h: js.ca.pz2e.create_hazard(newToken, tokenName)]
[h: setProperty("myID", newToken, newToken)]
[h: setHasSight(0, newToken)]
[h: setVisible(0, newToken)]
[h: themeData = getLibProperty("pf2e_themes","Lib:ca.pf2e")]
[h: themeNames = json.fields(themeData,"json")]
[h: currentTheme = json.indexOf(themeNames, getLibProperty("selectedTheme","Lib:ca.pf2e"))]
[h: ans = input("newTheme|"+themeNames+"|Theme|LIST|VALUE=STRING DELIMITER=JSON SELECT="+currentTheme)]
[h: abort(ans)]
[h: setLibProperty("selectedTheme", newTheme, "Lib:ca.pf2e")]
[h, if(isFrameVisible("Compendium")), code:{
	[h: ca.pf2e.Compendium_Home()]
};{}]
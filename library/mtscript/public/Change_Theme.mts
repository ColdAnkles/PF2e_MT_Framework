[h: themeData = getLibProperty("pz2e_themes","Lib:ca.pz2e")]
[h: themeNames = json.fields(themeData,"json")]
[h: currentTheme = json.indexOf(themeNames, getLibProperty("selectedTheme","Lib:ca.pz2e"))]
[h: ans = input("newTheme|"+themeNames+"|Theme|LIST|VALUE=STRING DELIMITER=JSON SELECT="+currentTheme)]
[h: abort(ans)]
[h: setLibProperty("selectedTheme", newTheme, "Lib:ca.pz2e")]
[h, if(isFrameVisible("Compendium")), code:{
	[h: ca.pz2e.Compendium_Home()]
};{}]
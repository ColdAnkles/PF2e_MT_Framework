<!-- Duplicate onInit Code-->
[h: vFunctionPrefix = "ca.pz2e."]
[h: vJSRegEx = ".*\\.js\$"]
[h: vJSNameSpace = "ca.pz2e"]
[h: js.createNS(vJSNameSpace)]
[h: libContents = library.getContents("ca.pz2e")]

[h: scripts = "[]"]
[h: imageList = "[]"]
[h, foreach(item, libContents), code:{
	[h: mtscriptMatch = matches(item, "mtscript.*")]
    [h: jsMatch = matches(item, ".*\.js")]
    [h: pngMatch = matches(item, ".*\.png")]
    [h, if(mtscriptMatch || jsMatch), code:{
    	[h: scripts = json.append(scripts, item)]
    };{}]
    [h, if(pngMatch), code:{
        [h: imageList = json.append(imageList, item)]
    };{}]
}]

[h, foreach(item, scripts), code:{
	[h: id = strfind(item, ".*/(.*)")]
	[h: name = replace(getGroup(id, 1, 1), ".mts", "")]
	[h: path = replace(item, "^public/", "")]
    [if(!matches(item, vJSRegex)):
        defineFunction(vFunctionPrefix + name, name + "@Lib:ca.pz2e");
        js.evalURI(vJSNameSpace, "lib://ca.pz2e/" + path)]
}]

[h: imageDict = "{}"]
[h, foreach(image, imageList), code:{
    [h: id = strfind(image, "/([^/]*)\$")]
    [h: fileName = getGroup(id, 1, 1)]
    [h: id = strFind(fileName, "[^.]*")]
    [h: imageName = getGroup(id, 1, 0)]
    [h: assetString = "lib://ca.pz2e/" + replace(image, "public/", "")]
    [h: imageDict = json.set(imageDict, imageName, assetString)]
}]

[h: system = data.getStaticData('ca.pz2e', "public/data/system.txt")]
[h: setLibProperty("gameSystem", system, "Lib:ca.pz2e")]
[h: setLibProperty("image_dict", imageDict, "Lib:ca.pz2e")]
[h, if(system == "pf2e"), code:{
    [h: setLibProperty("selectedTheme", "Argrinyxia", "Lib:ca.pz2e")]
};{
    [h: setLibProperty("selectedTheme", "Veskarium", "Lib:ca.pz2e")]
}]

<!-- First Time Init Only-->
[h: customContentVar = json.set("{}","action","{}","ancestry","{}","background","{}","class","{}","condition","{}","effect","{}","feat","{}","hazard","{}","heritage","{}","item","{}","npc","{}","spell","{}","vehicle","{}","source","[]")]
[h: setLibProperty("customContent",customContentVar, "Lib:ca.pz2e")]

[h: maps = getAllMapNames("json")]
[h, if(json.contains(maps, "Grasslands")), code:{
    [h: setMapName("Grasslands", "Player Characters")]
};{
    [h: config = json.set("{}","player visible",json.true,"lighting style","OVERTOP","has fog",json.false,"background paint","#979fad")]
    [h: createMap("Player Characters",config)]
}]

[h: ca.pz2e.Load_Addon_JSON()]
[h: js.ca.pz2e.createGMMacros()]
[h: js.ca.pz2e.createCampaignMacros()]
[h: ca.pz2e.Welcome()]
[h: execFunction("ca.pz2e.updateUI", "[]", 1)]

[h, if(ca.pz2e.isLibraryLoaded("Lib:DateTime")), code:{
    [h: currentTheme = json.get(json.get(getLibProperty("pz2e_themes","Lib:ca.pz2e"), getLibProperty("selectedTheme","Lib:ca.pz2e")),"colours")]
	[h: themeData = json.set("{}","themeName","PZ2E")]
	[h: themeData = json.set(themeData,"bodyBackground", json.get(currentTheme,"standardBackground"))]
	[h: themeData = json.set(themeData,"bodyTextColour", json.get(currentTheme,"standardText"))]
	[h: themeData = json.set(themeData,"currentDayBG", "#478c42")]
	[h: themeData = json.set(themeData,"currentDayText", json.get(currentTheme,"standardText"))]
	[h: themeData = json.set(themeData,"otherDayBG", json.get(currentTheme,"traitInner"))]
	[h: themeData = json.set(themeData,"otherDayText", "black")]
	[h: themeData = json.set(themeData,"eventDayBG", "#800080")]
	[h: themeData = json.set(themeData,"headingABG", json.get(currentTheme,"titleBackground"))]
	[h: themeData = json.set(themeData,"headingBBG", json.get(currentTheme,"extraBackground"))]
	[h: themeData = json.set(themeData,"dayRowBG", "#0c1466")]
	[h: themeData = json.set(themeData,"dayRowText", json.get(currentTheme,"traitText"))]
	[h: themeData = json.set(themeData,"buttonRowBG", json.get(currentTheme,"titleBackground"))]
	[h: themeData = json.set(themeData,"eventDayText", json.get(currentTheme,"traitText"))]
	[h: themeData = json.set(themeData,"headingAText", json.get(currentTheme,"traitText"))]
	[h: themeData = json.set(themeData,"headingBText", json.get(currentTheme,"traitText"))]
	[h: themeData = json.set(themeData,"buttonRowText", json.get(currentTheme,"traitText"))]
	[h: themeData = json.set(themeData,"overlayBG", json.get(currentTheme,"titleBackground"))]
	[h: themeData = json.set(themeData,"overlayText", json.get(currentTheme,"traitInner"))]
	[h: js.datetime.saveTheme(themeData)]
    [h: js.datetime.setActiveTheme("PZ2E")]
};{}]
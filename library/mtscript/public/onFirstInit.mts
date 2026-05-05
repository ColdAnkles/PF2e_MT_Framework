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
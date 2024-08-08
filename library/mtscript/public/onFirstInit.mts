<!-- Duplicate onInit Code-->
[h: vFunctionPrefix = "ca.pf2e."]
[h: vJSRegEx = ".*\\.js\$"]
[h: vJSNameSpace = "ca.pf2e"]
[h: js.createNS(vJSNameSpace)]
[h: libContents = library.getContents("ca.pf2e")]

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
        defineFunction(vFunctionPrefix + name, name + "@Lib:ca.pf2e");
        js.evalURI(vJSNameSpace, "lib://ca.pf2e/" + path)]
}]

[h: imageDict = "{}"]
[h, foreach(image, imageList), code:{
    [h: id = strfind(image, "/([^/]*)\$")]
    [h: fileName = getGroup(id, 1, 1)]
    [h: id = strFind(fileName, "[^.]*")]
    [h: imageName = getGroup(id, 1, 0)]
    [h: assetString = "lib://ca.pf2e/" + replace(image, "public/", "")]
    [h: imageDict = json.set(imageDict, imageName, assetString)]
}]

[h: setLibProperty("image_dict", imageDict, "Lib:ca.pf2e")]
[h: setLibProperty("selectedTheme", "Golarion", "Lib:ca.pf2e")]

<!-- First Time Init Only-->
[h: setMapName("Grasslands", "Player Characters")]
[h: ca.pf2e.Load_Addon_JSON()]
[h: ca.pf2e.Create_GM_Macros()]
[h: ca.pf2e.Create_Campaign_Macros()]
[h: ca.pf2e.Welcome()]
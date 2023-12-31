[h: vFunctionPrefix = "ca.pf2e."]
[h: vJSRegEx = ".*\\.js\$"]
[h: vJSNameSpace = "ca.pf2e"]
[h: js.createNS(vJSNameSpace)]
[h: libContents = library.getContents("ca.pf2e")]

[h: scripts = "[]"]
[h: dataList = "[]"]
[h: imageList = "[]"]
[h, foreach(item, libContents), code:{
	[h: mtscriptMatch = matches(item, "mtscript.*")]
    [h: jsMatch = matches(item, ".*\.js")]
    [h: jsonMatch = matches(item, ".*data\/.*\.json")]
    [h: pngMatch = matches(item, ".*\.png")]
    [h, if(mtscriptMatch || jsMatch), code:{
    	[h: scripts = json.append(scripts, item)]
    };{}]
    [h, if(jsonMatch), code:{
        [h: dataList = json.append(dataList, item)]
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

[h, foreach(file, dataList), code:{
    [h: importData = data.getStaticData('ca.pf2e', file)]
    [h: id = strfind(file, "/([^/]*)\$")]
    [h: fileName = getGroup(id, 1, 1)]
    [h: id = strFind(fileName, "[^.]*")]
    [h: varName = getGroup(id, 1, 0)]
    [h: setLibProperty(varName, importData, 'Lib:ca.pf2e')]
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

[h: broadcast("Initialization Complete")]
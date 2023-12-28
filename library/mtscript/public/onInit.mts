[h: vFunctionPrefix = "ca.pf2e."]
[h: vJSRegEx = ".*\\.js\$"]
[h: vJSNameSpace = "ca.pf2e"]
[h: js.createNS(vJSNameSpace)]
[h: libContents = library.getContents("ca.pf2e")]

[h: scripts = "[]"]
[h, foreach(item, libContents), code:{
	[h: matchOne = matches(item, "mtscript.*")]
    [h: matchTwo = matches(item, ".*\.js")]
    [h, if(matchOne || matchTwo), code:{
    	[h: scripts = json.append(scripts, item)]
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

[h: broadcast("Initialization Complete")]
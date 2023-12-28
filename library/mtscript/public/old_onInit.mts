[h: "<!-- Make sure we can use URIs. -->"]
[h: "<!-- Blantantly Stolen from Melek's Elevation Library. -->"]
[h: 'setAllowsURIAccess(1)']

[h: "<!-- Set functions and run JS automatically in the the UDF groups. -->"]
[h: vLibName = getMacroLocation()]
[h: vUDFGroupREGEX = ".*UDF.*"]
[h: vMacros = getMacros("json")]
[h: vUDFMacroGroups = ""]
[h, foreach(vMacro, vMacros), code: {
	[vMacroIndex = getMacroIndexes(vMacro)]
	[vMacroProps = getMacroProps(vMacroIndex, "json")]
	[vMacroGroup = json.get(vMacroProps, "group")]
	[if(matches(vMacroGroup, vUDFGroupREGEX) && !json.contains(vUDFMacroGroups, vMacroGroup)):
		vUDFMacroGroups = json.append(vUDFMacroGroups, vMacroGroup)]
}]
[h: vFunctionPrefix = "pf2e."]
[h: vJSRegEx = ".*\\.js\$"]
[h: vJSNameSpace = "ca.pf2e"]
[h: js.createNS(vJSNameSpace)]
[h: js.evalNS(vJSNameSpace, "var UDFPrefix = '" + vFunctionPrefix + "';")]
[h: vMacroURIPrefix = "lib://" + listget(lower(vLibName), 1, ":") + "/macro/"]
[h: "<!-- Define functions and run JS -->"]
[h, foreach(vUDFMacroGroup, vUDFMacroGroups), code: {
	[h, foreach(vMacroIndex, getMacroGroup(vUDFMacroGroup)), code: {
		[vMacro = json.get(getMacroProps(vMacroIndex, "json"), "label")]
		[h: 'broadcast(vMacro)']
		[if(!matches(vMacro, vJSRegEx)): 
			defineFunction(vFunctionPrefix + vMacro, vMacro + "@" + vLibName);
			js.evalURI(vJSNameSpace, vMacroURIPrefix + vMacro)]
	}]
}]


[h: js.pf2e.find_pc_libs()]
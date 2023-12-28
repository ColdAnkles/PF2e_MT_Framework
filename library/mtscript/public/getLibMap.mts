[h: "
<!--Since Lib 1.0
	getLibMap() returns the name of the map Lib:pf2e resides on.
-->"]

[h: "<!-- Function vs. Button Behavior -->"]
[h: vClicked = json.contains(getMacroContext(), "buttonIndex")]

[h: "<!-- Function logic -->"]
[h: vLibMap   = getTokenMap(getMacroLocation())]

[h: "<!-- Return / Display result -->"]
[h: vReturn = vLibMap]
[h, if(vClicked): 
	broadcast("<pre>" + vReturn + "</pre>");
	return(0, vReturn)]

	
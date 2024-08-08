[frame5("Compendium", "width=300; height=600; temporary=0; noframe=0; input=1"):{
	<html>
	[h: cssName = "lib://ca.pf2e/css/" + json.get(json.get(getLibProperty("pf2e_themes","Lib:ca.pf2e"), getLibProperty("selectedTheme","Lib:ca.pf2e")),"css")]
	<link rel="stylesheet" type="text/css" href=[r:cssName]>

	
	<h1 style="padding-bottom:0px;margin-bottom:8px">
	<img src=[r: js.ca.pf2e.icon_img("compendium", true, true)] style="width:40;height:40;"/>&nbsp;
	[r:macroLink("<font size=6>Compendium</font>","Compendium_Home@Lib:ca.pf2e")]
	</h1>


	[h:'macro("Search Results@Lib:ca.pf2e"):macro.args+";window=Tables List"']
	<body>
	[js.ca.pf2e.build_compendium_home()]
	</body>
	</html>
}]


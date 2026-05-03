[h, if(json.type(macro.args)=="ARRAY"), code:{
	[h: macro.args = json.get(macro.args,0)]
};{}]
[h:tokenName=json.get(macro.args,"name")]
[h:tokenID=json.get(macro.args,"tokenID")]

[dialog5(tokenName, "width=1000; height=700; temporary=1; noframe=0; input=1"):{
	[h: cssName = "lib://ca.pz2e/css/" + json.get(json.get(getLibProperty("pz2e_themes","Lib:ca.pz2e"), getLibProperty("selectedTheme","Lib:ca.pz2e")),"css")]
	<link rel="stylesheet" type="text/css" href=[r:cssName]>


[r, if(tokenID=="null"), code:{
<p class='topbar'>
	[r:macroLink("Make Token","Spawn_Hazard@Lib:ca.pz2e","none",tokenName)]&nbsp;
</p>
};{}]

<body>
<p>[r, if(tokenID=="null"), code:{
	[r: js.ca.pz2e.build_hazard_view(tokenName)]</p>
};{
	[r: js.ca.pz2e.build_hazard_view(tokenName, tokenID)]</p>
}]
</body>
}]
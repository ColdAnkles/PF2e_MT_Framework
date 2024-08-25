[h, if(json.type(macro.args)=="ARRAY"), code:{
	[h: macro.args = json.get(macro.args,0)]
};{}]
[h:tokenName=json.get(macro.args,"name")]
[h:tokenID=json.get(macro.args,"tokenID")]

[frame5(tokenName, "width=1000; height=700; temporary=1; noframe=0; input=1"):{
	[h: cssName = "lib://ca.pf2e/css/" + json.get(json.get(getLibProperty("pf2e_themes","Lib:ca.pf2e"), getLibProperty("selectedTheme","Lib:ca.pf2e")),"css")]
	<link rel="stylesheet" type="text/css" href=[r:cssName]>


[r, if(tokenID=="null"), code:{
<p class='topbar'>
	Make Token: [r:macroLink("Weak","Spawn_NPC@Lib:ca.pf2e","none",json.append("[]",tokenName,"weak"))]&nbsp;[r:macroLink("Normal","Spawn_NPC@Lib:ca.pf2e","none",json.append("[]",tokenName,"normal"))]&nbsp;[r:macroLink("Elite","Spawn_NPC@Lib:ca.pf2e","none",json.append("[]",tokenName,"elite"))]&nbsp; [r:macroLink("Edit Creature","NPC_Editor@Lib:ca.pf2e","none",tokenName)]&nbsp;
</p>
};{}]

<body>
<p>[r, if(tokenID=="null"), code:{
	[js.ca.pf2e.build_creature_view(tokenName)]</p>
};{
	[js.ca.pf2e.build_creature_view(tokenName, tokenID)]</p>
}]
</body>
}]
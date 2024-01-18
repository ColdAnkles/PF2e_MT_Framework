[h, if(json.type(macro.args)=="ARRAY"), code:{
	[h: macro.args = json.get(macro.args,0)]
};{}]
[h:tokenName=json.get(macro.args,"name")]
[h:tokenID=json.get(macro.args,"tokenID")]

[dialog5(tokenName, "width=1000; height=700; temporary=1; noframe=0; input=1"):{

<link rel="stylesheet" type="text/css" href="lib://ca.pf2e/css/NethysCSS.css"/>


[r, if(tokenID=="null"), code:{
<p class='topbar'>
	[r:macroLink("Make Token","Spawn_Hazard@Lib:ca.pf2e","none",tokenName)]&nbsp;
</p>
};{}]

<body>
<p>[r, if(tokenID=="null"), code:{
	[js.ca.pf2e.build_hazard_view(tokenName)]</p>
};{
	[js.ca.pf2e.build_hazard_view(tokenName, tokenID)]</p>
}]
</body>
}]
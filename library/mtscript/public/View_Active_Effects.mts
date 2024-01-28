[h, if(json.type(macro.args)=="ARRAY"), code:{
	[h: macro.args = json.get(macro.args,0)]
};{}]
[h: tokenID = json.get(macro.args,"tokenID")]
[h: tokenName = getName(tokenID)]

[h, foreach(k, macro.args, ""), code:{
    [h, if(startsWith(k, "remove_")), code:{
        [h: js.ca.pf2e.toggle_named_effect(substring(k,7), tokenID, 0)]
    };{}]
}]

[frame5(tokenName, "width=100; height=300; temporary=1; noframe=0; input=1"):{

    <link rel="stylesheet" type="text/css" href="lib://ca.pf2e/css/NethysCSS.css"/>

    [js.ca.pf2e.active_effect_view(tokenID)]</p>
}]
[h, if(json.type(macro.args)=="ARRAY"), code:{
	[h: macro.args = json.get(macro.args,0)]
};{}]
[h: tokenID = json.get(macro.args,"tokenID")]
[h: tokenName = getName(tokenID)]

[h, foreach(k, macro.args, ""), code:{
    [h: isPersistent = matches(k,".*Persistent.*")]
    [h, if(startsWith(k, "remove_") && !isPersistent), code:{
        [h: js.ca.pz2e.toggle_named_effect(substring(k,7), tokenID, 0)]
    };{}]
    [h, if(startsWith(k, "remove_") && isPersistent), code:{
        [h: js.ca.pz2e.toggle_action_effect(json.set("{}","name",substring(k,7)), tokenID, 0)]
    };{}]
}]

[frame5(tokenName, "width=100; height=300; temporary=1;"):{

    [h: cssName = "lib://ca.pz2e/css/" + json.get(json.get(getLibProperty("pz2e_themes","Lib:ca.pz2e"), getLibProperty("selectedTheme","Lib:ca.pz2e")),"css")]
	<html><link rel="stylesheet" type="text/css" href=[r:cssName]><body class='compendium_body'>

    [r: js.ca.pz2e.active_effect_view(tokenID)]</p>
    </body></html>
}]
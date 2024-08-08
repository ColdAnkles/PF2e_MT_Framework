[frame5("Source Management", "width=450; height=600; temporary=0; noframe=0; input=1"):{
    [h: cssName = "lib://ca.pf2e/css/" + json.get(json.get(getLibProperty("pf2e_themes","Lib:ca.pf2e"), getLibProperty("selectedTheme","Lib:ca.pf2e")),"css")]
	<link rel="stylesheet" type="text/css" href=[r:cssName]>
	<h1 class="feel-title">Sources</h1>
    [js.ca.pf2e.enabled_source_list(macro.args)]
}]
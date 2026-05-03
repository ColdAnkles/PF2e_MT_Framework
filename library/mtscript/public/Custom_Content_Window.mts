[frame5("Custom Content", "width=450; height=600; temporary=0; noframe=0; input=1"):{
    [h: cssName = "lib://ca.pz2e/css/" + json.get(json.get(getLibProperty("pz2e_themes","Lib:ca.pz2e"), getLibProperty("selectedTheme","Lib:ca.pz2e")),"css")]
	<link rel="stylesheet" type="text/css" href=[r:cssName]>
	<h1 class="feel-title">Custom Content</h1>
    [r: js.ca.pz2e.custom_content_window(macro.args)]
}]
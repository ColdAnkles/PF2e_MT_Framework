[h:spellName=macro.args]

[frame5(spellName, "width=1000; height=700; temporary=0; noframe=0; input=1"):{

    [h: cssName = "lib://ca.pz2e/css/" + json.get(json.get(getLibProperty("pz2e_themes","Lib:ca.pz2e"), getLibProperty("selectedTheme","Lib:ca.pz2e")),"css")]
	<link rel="stylesheet" type="text/css" href=[r:cssName]>

<body>
<p>[r: js.ca.pz2e.build_spell_view(spellName)]</p>
</body>
}]
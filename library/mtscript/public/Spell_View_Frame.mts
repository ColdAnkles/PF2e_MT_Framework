[h:spellName=macro.args]

[frame5(spellName, "width=1000; height=700; temporary=0; noframe=0; input=1"):{

    [h: cssName = "lib://ca.pf2e/css/" + json.get(json.get(getLibProperty("pf2e_themes","Lib:ca.pf2e"), getLibProperty("selectedTheme","Lib:ca.pf2e")),"css")]
	<link rel="stylesheet" type="text/css" href=[r:cssName]>

<body>
<p>[js.ca.pf2e.build_spell_view(spellName)]</p>
</body>
}]
[h: js.ca.pz2e.get_foundry_sources()]
[dialog5("Source Management", "width=450; height=600; temporary=1; noframe=0; input=1"):{
    [h: cssName = "lib://ca.pz2e/css/" + json.get(json.get(getLibProperty("pz2e_themes","Lib:ca.pz2e"), getLibProperty("selectedTheme","Lib:ca.pz2e")),"css")]
	<link rel="stylesheet" type="text/css" href=[r:cssName]>
	<h1 class="feel-title">Foundry Data Packs</h1>
    [h: sourceList = data.getData("addon:", "ca.pz2e", "pz2e_source")]
    <table>
    <tr><th>Source Name</th><th>Import</th></tr>
    [foreach(s, sourceList, ""), code:{
        [h: sourceData = json.get(sourceList, s)]
        [h: name=ca.pz2e.Captialize(replace(s, "-", " "))]
        [h: name=replace(name, "Pfs", "PFS")]
        <tr><td>[r: name]</td><td>[r: macroLink("Import", "Import_Source@Lib:ca.pz2e","",s)]</td></tr>
    }]
    </table>
}]
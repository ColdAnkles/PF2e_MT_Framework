[h: js.ca.pf2e.get_foundry_sources()]
[dialog5("Source Management", "width=450; height=600; temporary=1; noframe=0; input=1"):{
    <link rel="stylesheet" type="text/css" href="lib://ca.pf2e/css/NethysCSS.css"/>
	<h1 class="feel-title">Sources</h1>
    [h: sourceList = data.getData("addon:", "ca.pf2e", "pf2e_source")]
    <table>
    <tr><th>Source Name</th><th>Import</th></tr>
    [foreach(s, sourceList, ""), code:{
        [h: sourceData = json.get(sourceList, s)]
        [h: name=ca.pf2e.Captialize(replace(s, "-", " "))]
        [h: name=replace(name, "Pfs", "PFS")]
        <tr><td>[r: name]</td><td>[r: macroLink("Import", "Import_Source@Lib:ca.pf2e","",s)]</td></tr>
    }]
    </table>
}]
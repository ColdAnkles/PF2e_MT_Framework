[h,if(macro.args==""):sort="name";sort=getStrProp(macro.args,"sort")]
[h,if(macro.args==""):dir="a";dir=getStrProp(macro.args,"dir")]

[h: rollNPC = 0 ]

[h,if(rollNPC==1):output=if(isGM()==1,outputGM,outputPC);output="none"]

[dialog5("Spell List", "width=1500; height=600; temporary=1; noframe=0; input=1"):{
	<link rel="stylesheet" type="text/css" href="lib://ca.pf2e/css/NethysCSS.css"/>
	<h1 class="feel-title">Spells</h1>
	[h: spellList=getLibProperty("pf2e_spell","Lib:ca.pf2e")]
	[h: jsonSpells = "[]"]
	[h, foreach(spell, spellList), code:{
		[h: jsonSpells = json.append(jsonSpells, json.get(spellList, spell))]
	}]
	
	[h:spellList=json.sort(jsonSpells,dir,sort)]
	[h:dir=if(getStrProp(macro.args,"dir")=="a","d","a")]

	[h:fields=json.fields(spellList)]

	<table>
	<tr>
	<th>
	[r:macroLink("Name","Spell_List_Window@Lib:ca.pf2e","","sort=name;dir="+dir)]
	<th>
	[r:macroLink("Type","Spell_List_Window@Lib:ca.pf2e","","sort=type;dir="+dir)]
	<th>
			Traditions
	<th>
	[r:macroLink("Rarity","Spell_List_Window@Lib:ca.pf2e","","sort=rarity;dir="+dir)]
	<th width=10% align=center>
		Traits
	<th width=5% align=center>
	[r:macroLink("Level","Spell_List_Window@Lib:ca.pf2e","","sort=level;dir="+dir)]
	<th width=20% align=center>
	[r:macroLink("Source","Spell_List_Window@Lib:ca.pf2e","","sort=source;dir="+dir)]
	
	[h:odd=1]
	[r,count(listcount(fields),"<br>"),code:{

		[h:currentObj=json.get(spellList,roll.count)]

		<tr class=[r:if(odd==1,"bg","")]>
		[h:odd=if(odd==1,0,1)]
		<td>
		[h:name=json.get(currentObj,"name")]
		[h:CapitalName=js.ca.pf2e.capitalize(name)]
		[r:macroLink(CapitalName,"Spell_View_Frame@Lib:ca.pf2e","",name)]
		<td>
		[r:type = js.ca.pf2e.capitalize(json.get(currentObj, "type"))]
		<td>
		[h: traditions = json.get(currentObj, "traditions")]
		[r: js.ca.pf2e.capitalize(json.toList(traditions,", "))]
		<td align=center>
		[r:rarity = js.ca.pf2e.capitalize(json.get(currentObj, "rarity"))]
		<td>
		[h: traits = json.get(currentObj, "traits")]
		[r: js.ca.pf2e.capitalize(json.toList(traits,", "))]
		<td align=center>
		[r:level=json.get(currentObj,"level")]
		<td align=center>
		[r:source=json.get(currentObj,"source")]
	}]

}]
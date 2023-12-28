[h,if(macro.args==""):sort="name";sort=getStrProp(macro.args,"sort")]
[h,if(macro.args==""):dir="a";dir=getStrProp(macro.args,"dir")]

[h: rollNPC = 0 ]

[h,if(rollNPC==1):output=if(isGM()==1,outputGM,outputPC);output="none"]

[dialog5("Creature List", "width=900; height=600; temporary=1; noframe=0; input=1"):{
	<link rel="stylesheet" type="text/css" href="lib://ca.pf2e/css/NethysCSS.css"/>
	<h1 class="feel-title">Bestiary</h1>
	[h: 'npcList=getLibProperty("pf2e_npc","Lib:ca.pf2e")']
	[h: npcList=data.getData("addon:", "ca.pf2e", "pf2e_npc")]
	[h: jsonNPC = "[]"]
	[h, foreach(npc, npcList), code:{
		[h: jsonNPC = json.append(jsonNPC, json.get(npcList, npc))]
	}]
	
	[h:jsonNPC=json.sort(jsonNPC,dir,sort)]
	[h:dir=if(getStrProp(macro.args,"dir")=="a","d","a")]

	[h:fields=json.fields(jsonNPC)]

	<table>
	<tr>
	<th>
	[r:macroLink("Name","Creature_List_Window@Lib:ca.pf2e","","sort=name;dir="+dir)]
	<th>
	[r:macroLink("Type","Creature_List_Window@Lib:ca.pf2e","","sort=npcType;dir="+dir)]
	<th>
	[r:macroLink("Rarity","Creature_List_Window@Lib:ca.pf2e","","sort=rarity;dir="+dir)]
	<th width=10% align=center>
	[r:macroLink("Size","Creature_List_Window@Lib:ca.pf2e","","sort=size;dir="+dir)]
	<th width=5% align=center>
	[r:macroLink("Level","Creature_List_Window@Lib:ca.pf2e","","sort=level;dir="+dir)]
	<th width=20% align=center>
	[r:macroLink("Source","Creature_List_Window@Lib:ca.pf2e","","sort=source;dir="+dir)]
	<th>Spawn Link
	[h:odd=1]
	[r,count(listcount(fields),"<br>"),code:{

		[h:currentObj=json.get(jsonNPC,roll.count)]

		<tr class=[r:if(odd==1,"bg","")]>
		[h:odd=if(odd==1,0,1)]
		<td>
		[h:name=json.get(currentObj,"name")]

<!---------------------------CAPITALIZE----------------------------->
[h:CapitalName=js.ca.pf2e.capitalize(name)]


		
		[r:macroLink(CapitalName,"Creature_View_Frame@Lib:ca.pf2e","",json.set("{}","name",name,"tokenID","null"))]
		<td>
		[r:type = json.get(currentObj, "npcType")]
		<td>
		[r:rarity = js.ca.pf2e.capitalize(json.get(currentObj, "rarity"))]
		<td>
		[h:size = json.get(currentObj, "size")]
		[h: size = json.get("{sm:small,med:medium,huge:huge,lg:large,grg:gargantuan,tiny:tiny}",size)]
		[r: js.ca.pf2e.capitalize(size)]
		<td align=center>
		[r:level=json.get(currentObj,"level")]
		<td align=center>
		[r:source=json.get(currentObj,"source")]
		<td width=0%>
		[r:macroLink("Make Token","Spawn_NPC@Lib:ca.pf2e",output,name)]
	
	}]

}]
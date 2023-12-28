[h:terms=getStrProp(macro.args,"terms")]
[h:results=getStrProp(macro.args,"results")]
[h:output=decode(getStrProp(macro.args,"output"))]
[h:window=getStrProp(macro.args,"window")]

[h:processorLink=macroLinkText("Search Process@Lib:pf2e","")]
<form action="[r:processorLink]" method="json">

	<table>
	<tr><td>

	<input type="hidden" name="window" value="[r:window]">
	
	<table width=100%>
	<tr><td align=right>
	<input type="text" name="terms" value="[r:terms]" size="30">
	<td align=left>
	<input type="submit" name="button" value="Search">
	</table>

	<tr><td style="margin:0px;padding:0px;padding-left:[r:if(window=='search','25px','0px')]">

	<!-------------------PCs------------------->
	[h:outputPCs=getStrProp(output,"PC")]
	[r,count(listcount(outputPCs),""),code:{

		[r,if(roll.count==0):"<h5>Characters</h5><p>"]
				
		[h:currentPCName=listget(outputPCs,roll.count)]
		<!---------------------------CAPITALIZE----------------------------->
		[h:CapitalName=capitalize(currentPCName)]
		[h:CapitalName=replace(CapitalName,"(?<=\\s)Of(?=\\s)","of")]
		[h:CapitalName=replace(CapitalName,"(?<=\\s)A(?=n?\\s)","a")]
		[h:CapitalName=replace(CapitalName,"(?<=\\s)Th(?=(?:e|at|ose)\\s)","th")]
		[h:CapitalName=replace(CapitalName,"'S(?=\\s)","'s")]
		[r:macroLink(CapitalName,"Macro Frame@Lib:Character","","macro=Statblock;tokenName="+currentPCName)+"<br>"]
	}]


	<!-------------------NOTES------------------->
	[h:outputNotes=getStrProp(output,"Notes")]
	[r,count(listcount(outputNotes),""),code:{

		[r,if(roll.count==0):"<h5>Notes</h5><p>"]
		
		[h:currentNotebook=listget(outputNotes,roll.count)]
		[h:ChapterName=listget(currentNotebook,0,"@")]
		[h:NotebookName=listget(currentNotebook,1,"@")]

		[h:valueField=getLibProperty("Value",NotebookName)]
		[h:jsonValue=json.get(valueField,ChapterName)]

		[r:macroLink(ChapterName+" ("+replace(NotebookName,"^Lib:","")+")","Content@Lib:Notebook","","key="+ChapterName+";description="+encode(jsonValue)+";tokenName="+NotebookName)+"<br>"]
	}]


	<!-------------------CLASSES------------------->
	[h:outputClasses=getStrProp(output,"Classes")]
	[r,count(listcount(outputClasses),""),code:{

		[r,if(roll.count==0):"<h5>Classes</h5><p>"]
		
		[h:currentClassName=listget(outputClasses,roll.count)]
		<!---------------------------CAPITALIZE----------------------------->
		[h:CapitalName=capitalize(currentClassName)]
		[h:CapitalName=replace(CapitalName,"(?<=\\s)Of(?=\\s)","of")]
		[h:CapitalName=replace(CapitalName,"(?<=\\s)A(?=n?\\s)","a")]
		[h:CapitalName=replace(CapitalName,"(?<=\\s)Th(?=(?:e|at|ose)\\s)","th")]
		[h:CapitalName=replace(CapitalName,"'S(?=\\s)","'s")]
		[r:macroLink(CapitalName,"Class Window@Lib:Tables","","class="+currentClassName)+"<br>"]
	}]

	<!-------------------SUBCLASSES------------------->
	[h:outputSubclasses=getStrProp(output,"Subclasses")]
	[r,count(listcount(outputSubclasses),""),code:{

		[r,if(roll.count==0):"<h5>Subclasses</h5><p>"]
		
		[h:currentSubclass=listget(outputSubclasses,roll.count)]
		[h:ClassName=listget(currentSubclass,0,"/")]
		[h:SubclassName=listget(currentSubclass,1,"/")]
		<!---------------------------CAPITALIZE----------------------------->
		[h:CapitalName=capitalize(SubclassName)]
		[h:CapitalName=replace(CapitalName,"(?<=\\s)Of(?=\\s)","of")]
		[h:CapitalName=replace(CapitalName,"(?<=\\s)A(?=n?\\s)","a")]
		[h:CapitalName=replace(CapitalName,"(?<=\\s)Th(?=(?:e|at|ose)\\s)","th")]
		[h:CapitalName=replace(CapitalName,"'S(?=\\s)","'s")]		
		[r:macroLink(CapitalName,"Class View Frame@Lib:pf2e","","class="+ClassName)+"<br>"]
	}]
	
	<!-------------------EQUIPMENT------------------->
	[h:outputEquip=getStrProp(output,"Equipment")]
	[h:equipmentObject=getLibProperty("pf2e_items","Lib:pf2e")]
	[r,count(listcount(outputEquip),""),code:{

		[r,if(roll.count==0):"<h5>Equipment</h5><p>"]
				
		[h:currentEquipmentName=listget(outputEquip,roll.count)]
		<!---------------------------CAPITALIZE----------------------------->
		[h:CapitalName=capitalize(currentEquipmentName)]
		[h:CapitalName=replace(CapitalName,"(?<=\\s)Of(?=\\s)","of")]
		[h:CapitalName=replace(CapitalName,"(?<=\\s)A(?=n?\\s)","a")]
		[h:CapitalName=replace(CapitalName,"(?<=\\s)Th(?=(?:e|at|ose)\\s)","th")]
		[h:CapitalName=replace(CapitalName,"'S(?=\\s)","'s")]
		[r:macroLink(CapitalName,"Args Dialog@Lib:Campaign","","prop=Equipment;index=;name="+currentEquipmentName+";customName=;identified=1;description=;tokenName=Lib:Compendium")+"<br>"]
	}]


	<!-------------------Spells------------------->
	[h:outputSpells=getStrProp(output,"Spells")]
	[h:SpellsObject=getLibProperty("Spells","Lib:pf2e")]
	[r,count(listcount(outputSpells),""),code:{

		[r,if(roll.count==0):"<h5>Spells</h5><p>"]
	
		[h:currentSpellsName=listget(outputSpells,roll.count)]
		<!---------------------------CAPITALIZE----------------------------->
		[h:CapitalName=capitalize(currentSpellsName)]
		[h:CapitalName=replace(CapitalName,"(?<=\\s)Of(?=\\s)","of")]
		[h:CapitalName=replace(CapitalName,"(?<=\\s)A(?=n?\\s)","a")]
		[h:CapitalName=replace(CapitalName,"(?<=\\s)Th(?=(?:e|at|ose)\\s)","th")]
		[h:CapitalName=replace(CapitalName,"'S(?=\\s)","'s")]
		[r:macroLink(CapitalName,"Args Dialog@Lib:Campaign","","prop=Spells;source=;name="+currentSpellsName+";description=;tokenName=Lib:Compendium")+"<br>"]
	}]



	<!-------------------FEATS------------------->
	[h:outputFeats=getStrProp(output,"Feats")]
	[h:featsObject=getLibProperty("pf2e_feats","Lib:pf2e")]
	[r,count(listcount(outputFeats),""),code:{

		[r,if(roll.count==0):"<h5>Features & Traits</h5><p>"]

		[h:currentFeatsName=listget(outputFeats,roll.count)]
		<!---------------------------CAPITALIZE----------------------------->
		[h:CapitalName=capitalize(currentFeatsName)]
		[h:CapitalName=replace(CapitalName,"(?<=\\s)Of(?=\\s)","of")]
		[h:CapitalName=replace(CapitalName,"(?<=\\s)A(?=n?\\s)","a")]
		[h:CapitalName=replace(CapitalName,"(?<=\\s)Th(?=(?:e|at|ose)\\s)","th")]
		[h:CapitalName=replace(CapitalName,"'S(?=\\s)","'s")]
		[r:macroLink(CapitalName,"Args Dialog@Lib:Campaign","","prop=Feats;source=;name="+currentFeatsName+";description=;tokenName=Lib:Compendium")+"<br>"]
	}]

	<!-------------------BESTIARY------------------->
	[h:outputMonster=getStrProp(output,"Bestiary")]
	[h:listMonster=getLibProperty("pf2e_npc","Lib:pf2e")]
	[r,count(listcount(outputMonster),""),code:{

		[r,if(roll.count==0):"<h5>Bestiary</h5><p>"]
	
		[h:currentMonsterName=listget(outputMonster,roll.count)]
		<!---------------------------CAPITALIZE----------------------------->
		[h:CapitalName=capitalize(currentMonsterName)]
		[h:CapitalName=replace(CapitalName,"(?<=\\s)Of(?=\\s)","of")]
		[h:CapitalName=replace(CapitalName,"(?<=\\s)A(?=n?\\s)","a")]
		[h:CapitalName=replace(CapitalName,"(?<=\\s)Th(?=(?:e|at|ose)\\s)","th")]
		[h:CapitalName=replace(CapitalName,"'S(?=\\s)","'s")]
		[r:macroLink(CapitalName,"Creature View Frame@Lib:pf2e","",currentMonsterName)+"<br>"]
	}]

	<!-------------------NOTES------------------->
	[h:outputNotebooks=getStrProp(output,"Notebooks")]
	[r,count(listcount(outputNotebooks),""),code:{

		[r,if(roll.count==0):"<h5>Notebooks</h5><p>"]
		
		[h:currentNotebook=listget(outputNotebooks,roll.count)]


		[r:macroLink(replace(currentNotebook,"^Lib:",""),"Notebook@"+currentNotebook,"")+"<br>"]
	}]


	<!-------------------MAPS------------------->
	[h:outputMaps=getStrProp(output,"Maps")]
	[r,count(listcount(outputMaps),""),code:{

		[r,if(roll.count==0):"<h5>Maps</h5><p>"]
	
		[h:currentMapName=listget(outputMaps,roll.count)]
		<!---------------------------CAPITALIZE----------------------------->
		[h:CapitalName=capitalize(currentMapName)]
		[h:CapitalName=replace(CapitalName,"(?<=\\s)Of(?=\\s)","of")]
		[h:CapitalName=replace(CapitalName,"(?<=\\s)A(?=n?\\s)","a")]
		[h:CapitalName=replace(CapitalName,"(?<=\\s)Th(?=(?:e|at|ose)\\s)","th")]
		[h:CapitalName=replace(CapitalName,"'S(?=\\s)","'s")]
	[r:macroLink(CapitalName,"Select Map process@Lib:pf2e","",json.fromStrProp(currentMapName))]
	}]


	<!-------------------IMAGES------------------->
	[h:outputHandout=getStrProp(output,"Handouts")]
	[r,count(listcount(outputHandout),""),code:{

		[r,if(roll.count==0):"<h5>Images</h5><p>"]

		[h:currentHandout=listget(outputHandout,roll.count)]
		[r:macroLink(currentHandout,"Image Popup@Lib:Campaign","","name=image:"+currentHandout+";size=495")+"<br>"]
	}]




	</table>
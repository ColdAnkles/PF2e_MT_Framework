"use strict";

function build_compendium_home(){
	MTScript.evalMacro("[h: isGM = isGM()]");
	let isGM = MTScript.getVariable("isGM")
	
	let HTMLString = "";

	HTMLString = HTMLString + "</p><h2>Characters</h2><p>";

	let pcList = find_pc_libs();
	for (var pc in pcList){
		let pcName = pcList[pc].getName().replace("Lib:","");
		HTMLString = HTMLString + "<b>" + create_macroLink(pcName,"Creature_View_Frame@Lib:ca.pf2e",JSON.stringify({"name":pcName,"tokenID":pcList[pc].getId()})) + "</b> <span style='font-size:10px'>" + create_macroLink("Reimport","Import_Pathbuilder_PC@Lib:ca.pf2e",pcList[pc].getId()) + "</span><br />";
	}
	HTMLString = HTMLString + create_macroLink("Import from Pathbuilder", "Import_Pathbuilder_PC@Lib:ca.pf2e","") + "<br />";

	HTMLString = HTMLString + "<h2>"+create_macroLink("Spells","Spell_List_Window@Lib:ca.pf2e","") + "</h2>";
	
	if (isGM){
		HTMLString = HTMLString + "<h2>" + create_macroLink("Creature List","Creature_List_Window@Lib:ca.pf2e","") + "</h2>";
		HTMLString = HTMLString + "<h2>" + create_macroLink("Enabled Sources","Enabled_Sources_Window@Lib:ca.pf2e","") + "</h2>";
		HTMLString = HTMLString + "<h2>" + create_macroLink("Source Importing","Source_Management_Window@Lib:ca.pf2e","") + "</h2>";
	}

	
	return HTMLString;
}

MTScript.registerMacro("ca.pf2e.build_compendium_home", build_compendium_home);
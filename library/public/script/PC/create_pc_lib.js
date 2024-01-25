"use strict";

function create_pc_lib(pathbuilderID, tokenID){
	let PCData = get_pathbuilder_export_via_id(pathbuilderID);

	for(var c in PCData.pets){
		let petData = PCData.pets[c];
		petData.ownerID = tokenID;
		petData.level = PCData.level;
		if (petData.type=="Animal Companion"){
			setup_animal_companion(petData);
		}
	}
	PCData.pets = {};

	write_creature_properties(PCData, tokenID);
	
	for(var f in PCData.familiars){
		setup_familiar({"PCData":PCData, "familiarData":PCData.familiars[f], "ownerID":tokenID});
	}
	
}

MTScript.registerMacro("ca.pf2e.create_pc_lib", create_pc_lib);
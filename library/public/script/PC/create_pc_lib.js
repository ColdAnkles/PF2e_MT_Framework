"use strict";

function create_pc_lib(pathbuilderID, tokenID){
	let PCData = get_pathbuilder_export_via_id(pathbuilderID);

	for(var c in PCData.pets){
		let petData = PCData.pets[c];
		petData.ownerID = tokenID;
		if (petData.type=="Animal Companion"){
			setup_animal_companion(petData);
		}
	}
	PCData.pets = {};

	write_creature_properties(PCData, tokenID);
	
}

MTScript.registerMacro("ca.pf2e.create_pc_lib", create_pc_lib);
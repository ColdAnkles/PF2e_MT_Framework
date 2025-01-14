"use strict";

function create_pc_lib(pathbuilderID, tokenID) {
	let PCData = null;
	try {
		if (String(pathbuilderID) == "-1") {
			PCData = get_pathbuilder_export_via_input();
		} else {
			PCData = get_pathbuilder_export_via_id(pathbuilderID);
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in create_pc_lib - getting pb export");
		MapTool.chat.broadcast("pathbuilderID: " + String(pathbuilderID));
		MapTool.chat.broadcast("tokenID: " + String(tokenID));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	for (var c in PCData.pets) {
		let petData = PCData.pets[c];
		petData.ownerID = tokenID;
		petData.level = PCData.level;
		if (petData.type == "Animal Companion") {
			setup_animal_companion(petData);
		}
	}
	PCData.pets = {};

	write_creature_properties(PCData, tokenID);

	for (var f in PCData.familiars) {
		setup_familiar({ "PCData": PCData, "familiarData": PCData.familiars[f], "ownerID": tokenID });
	}

}

MTScript.registerMacro("ca.pf2e.create_pc_lib", create_pc_lib);
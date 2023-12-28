"use strict";

function create_pc_lib(pathbuilderID, tokenID){
	let PCData = get_pathbuilder_export_via_id(pathbuilderID);
	write_creature_properties(PCData, tokenID);
	
}

MTScript.registerMacro("ca.pf2e.create_pc_lib", create_pc_lib);
"use strict";

function get_pathbuilder_export_via_id(idNumber){
	let baseURL = "https://pathbuilder2e.com/json.php?id=";
	idNumber=String(idNumber);
	let fullURL = baseURL+idNumber
	let data = rest_call(fullURL,"");
	if (data.success){
		let parsed = parse_pathbuilder_export(data.build);
		return parsed;
	}else{
		MapTool.chat.broadcast("Error retrieving Pathbuilder build");
	}
}

MTScript.registerMacro("ca.pf2e.get_pathbuilder_export_via_id", get_pathbuilder_export_via_id);
"use strict";

function get_object_data(key, type) {
	//MapTool.chat.broadcast(String(JSON.stringify(key)));
	//MapTool.chat.broadcast(String(JSON.stringify(type)));
	//let libToken = get_runtime("libToken");
	let property = "";
	try {
		//property = JSON.parse(libToken.getProperty("pf2e_"+type));
		property = JSON.parse(read_data("pf2e_" + type));
		//MapTool.chat.broadcast(String(JSON.stringify(property)));
	} catch (error) {
		MapTool.chat.broadcast(String(error));
		property = {};
	}
	MapTool.chat.broadcast(String(JSON.stringify(property[key])));
	return JSON.stringify(property[key]);
}

MTScript.registerMacro("ca.pf2e.get_object_data", get_object_data);
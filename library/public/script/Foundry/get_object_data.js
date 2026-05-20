"use strict";

function get_object_data(key, type) {
	let property = "";
	try {
		//property = JSON.parse(libToken.getProperty("pz2e_"+type));
		property = JSON.parse(read_data("pz2e_" + type));
		//MapTool.chat.broadcast(String(JSON.stringify(property)));
	} catch (error) {
		MapTool.chat.broadcast(String(error));
		property = {};
	}
	MapTool.chat.broadcast(String(JSON.stringify(property[key])));
	return JSON.stringify(property[key]);
}

MTScript.registerMacro("ca.pz2e.get_object_data", get_object_data);
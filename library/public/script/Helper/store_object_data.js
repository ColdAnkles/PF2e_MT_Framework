"use strict";

function store_object_data(data) {
	//let libToken = get_runtime("libToken");
	//MapTool.chat.broadcast("Storing Data");
	//MapTool.chat.broadcast(JSON.stringify(data));
	//MapTool.chat.broadcast(data.type);
	let property = null;
	try {
		//property = JSON.parse(libToken.getProperty("pf2e_"+data.type));
		//property = JSON.parse(getLibProperty("Lib:ca.pf2e","pf2e_"+data.type));
		property = JSON.parse(read_data("pf2e_"+data.type));
	} catch(error) {
		MapTool.chat.broadcast(String(error));
		property = {};
	}
	if (property === null || property === ""){
		property = {};
	}
	property[data.name] = data;
	//MapTool.chat.broadcast(JSON.stringify(property[data.name]));
	//libToken.setProperty("pf2e_"+data.type, JSON.stringify(property));
	//setLibProperty("Lib:ca.pf2e","pf2e_"+data.type,JSON.stringify(property));
	write_data("pf2e_"+data.type, JSON.stringify(property));
}

MTScript.registerMacro("ca.pf2e.store_object_data",store_object_data);

"use strict";

function import_and_parse(key, type, asString = true) {
	let data = null;
	try {
		let property = JSON.parse(read_data("pz2e_" + type));
		data = search_dict(property, "name", key);
		if (data.length > 0) {
			data = data[0];
		} else {
			if (asString) {
				return "";
			} else {
				return null;
			}
		}
		if ("fileURL" in data) {
			data = rest_call(data["fileURL"], "");
		}
		if (!("id" in data) && "_id" in data) {
			data.id = data._id;
		}
		property[data.id] = data;
		write_data("pz2e_" + type, JSON.stringify(property));
		let returnData = "";
		if (String(type) === "npc") {
			returnData = parse_npc(data);
		} else {
			returnData = data;
		}
		if (asString) {
			return JSON.stringify(returnData);
		} else {
			return returnData;
		}
	} catch (e) {
		if (String(e).startsWith("Error: PZ2E")) {
			throw e;
		}
		MapTool.chat.broadcast("Error in import_and_parse");
		MapTool.chat.broadcast("key: " + key);
		MapTool.chat.broadcast("type: " + type);
		MapTool.chat.broadcast("asString: " + String(asString));
		MapTool.chat.broadcast("data: " + JSON.stringify(data));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		throw new Error("PZ2E: Error in import_and_parse");
	}
}

MTScript.registerMacro("ca.pz2e.import_and_parse", import_and_parse);
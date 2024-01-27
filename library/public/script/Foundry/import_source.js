"use strict";

function import_source_file(fileURL){
		let data = rest_call(fileURL, "");
		//MapTool.chat.broadcast(JSON.stringify(data));
		//MapTool.chat.broadcast(data.type);
		//.system.details));
		let storeData = {}
		storeData.name = data.name;
		storeData.type = data.type;
		storeData.id = data._id;
		storeData.minimal = false;
		storeData.fileURL = fileURL;
		if (data.type == "npc") {
			storeData.traits = data.system.traits.value;
			storeData.level = data.system.details.level.value;
			storeData.npcType = data.system.details.creatureType;
			storeData.rarity = data.system.traits.rarity;
			storeData.size = data.system.traits.size.value;
			storeData.source = data.system.details.publication.title;
			store_object_data(storeData);
		}else if (data.type == "action"){
			storeData.traits = data.system.traits.value;
			storeData.actionCost = data.system.actions.value;
			storeData.actionType = data.system.actionType.value;
			storeData.category = data.system.category;
			storeData.requirements = data.system.requirements;
			storeData.description = data.system.description.value;
			storeData.source = data.system.source.value;
			store_object_data(storeData);
		}else if (data.type == "ancestry"){
			storeData.traits = data.system.traits.value;
			storeData.rarity = data.system.traits.rarity;
			storeData.source = data.system.details.publication.title;
			store_object_data(storeData);
		}else if (data.type == "condition"){
			storeData.description = data.system.description.value;
			storeData.overrides = data.system.overrides;
			storeData.value = data.system.value;
			storeData.rules = data.system.rules;
			storeData.source = data.system.publication.title;
			store_object_data(storeData);
		}else if (data.type == "class"){
			storeData.source = data.system.publication.title;
			storeData.rarity = data.system.traits.rarity;
			store_object_data(storeData);
		}else if(data.type == "feat"){
			storeData.source = data.system.publication.title;
			storeData.rarity = data.system.traits.rarity;
			storeData.traits = data.system.traits.value;
			storeData.actionCost = data.system.actions.value;
			storeData.actionType = data.system.actionType.value;
			storeData.level = data.system.level.value;
			//MapTool.chat.broadcast(JSON.stringify(storeData));
			store_object_data(storeData);
		}else if (data.type == "spell"){
			storeData.source = data.system.publication.title;
			storeData.rarity = data.system.traits.rarity;
			storeData.traits = data.system.traits.value;
			storeData.traditions = data.system.traits.traditions;
			storeData.level = data.system.level.value;
			store_object_data(storeData);
		}else if (data.type == "hazard"){
			storeData.source = data.system.details.publication.title;
			storeData.rarity = data.system.traits.rarity;
			storeData.traits = data.system.traits.value;
			storeData.level = data.system.details.level.value;
			storeData.isComplex = data.system.isComplex;
			storeData.hazardType = data.system.value;
			store_object_data(storeData);
		}else if (data.type == "effect"){
			storeData.source = data.system.publication.title;
			storeData.duration = data.system.duration;
			storeData.rules = data.system.rules;
			storeData.start = data.system.start;
			store_object_data(storeData);
		}else if (data.type == "heritage"){
			storeData.source = data.system.publication.title;
			storeData.description = data.system.description.value;
			storeData.ancestry = data.system.ancestry;
			storeData.rules = data.system.rules;
			storeData.traits = data.system.traits.value;
			storeData.rarity = data.system.traits.rarity;
			store_object_data(storeData);
		}else if (data.type == "weapon" || data.type == "armor" || data.type == "consumable" || data.type == "equipment" || data.type == "shield" || data.type == "treasure" || $data.type == "backpack"){
				storedata.type = "item";
				storeData.source = data.system.publication.title;
				storeData.rules = data.system.rules;
				storeData.traits = data.system.traits.value;
				storeData.rarity = data.system.traits.rarity;
				storeData.itemType = data.system.type;
				storeData.level = data.system.level.value;
				storeData.bulk = data.system.bulk.value;
		}else{
			MapTool.chat.broadcast(JSON.stringify(data));
		}
}

function import_source(sourceName) {
	//let libToken = get_runtime("libToken");
	//let property = JSON.parse(libToken.getProperty("foundrySourceData"));
	let property = JSON.parse(read_data("pf2e_source"));
	let sourceData = null;
	if (sourceName in property){
		sourceData = property[sourceName];
	}else{
		MapTool.chat.broadcast("Could not find source \"" + sourceName + "\"");
		//MapTool.chat.broadcast(JSON.stringify(Object.keys(property)));
		return;
	}
	
	let base_file_path = "https://raw.githubusercontent.com/foundryvtt/pf2e/master/packs/";
	for (var file in sourceData.content){
		let fileData = sourceData.content[file];
		//MapTool.chat.broadcast("Importing " + file);
		import_source_file(base_file_path + fileData.path);
	}
	MapTool.chat.broadcast("Finished Importing");
}


MTScript.registerMacro("ca.pf2e.import_source", import_source);
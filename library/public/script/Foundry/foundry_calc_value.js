"use strict";

function foundry_calc_value(value, actor, item) {
	let newValue = Number(value);
	if (isNaN(newValue)) {
		if (typeof (value) == "object") {
			if ("brackets" in value) {
				let bracketSplit = value.field.split("|");
				//MapTool.chat.broadcast(JSON.stringify(value.brackets));
				let splitVal = 0;
				if (bracketSplit[0] == "actor" && actor!=null) {
					splitVal = actor.getProperty(bracketSplit[1]);
				}
				//MapTool.chat.broadcast(String(splitVal));
				for(var s in value.brackets){
					let startVal = 0;
					let endVal = 0;
					let bracket = value.brackets[s];
					if("start" in bracket){
						startVal = bracket.start;
					}
					if("end" in bracket){
						endVal = bracket.end;
					}
					if(splitVal >=startVal && splitVal<=endVal){
						value = bracket.value;
						break;
					}
				}
			} else {
				return 0;
			}
		}
		//MapTool.chat.broadcast(value);
		let foundMatches = value.match(/@[a-zA-Z\.]+/g);
		for (var m in foundMatches) {
			//MapTool.chat.broadcast(String(foundMatches[m]));
			let splitStrings = foundMatches[m].split(".");
			if (splitStrings[0] == "@actor") {
				if (actor == null) {
					MapTool.chat.broadcast("Error! No actor when parsing value " + value);
					return null;
				}
				value = value.replaceAll(foundMatches[m], actor.getProperty(splitStrings[1]));
			} else if (splitStrings[0] == "@item" && splitStrings[1] == "value") {
				if (item == null) {
					MapTool.chat.broadcast("Error! No item when parsing value " + value);
					return null;
				}
				if (isNaN(Number(item.value))) {
					if ("value" in item.value) {
						value = value.replaceAll(foundMatches[m], item.value.value);
					}
				} else {
					value = value.replaceAll(foundMatches[m], item.value);
				}
			} else if (splitStrings[0] == "@item" && splitStrings[1] == "level") {
				if (item == null) {
					MapTool.chat.broadcast("Error! No item when parsing value " + value);
					return null;
				}
				if (isNaN(Number(item.level))) {
					if ("value" in item.level) {
						value = value.replaceAll(foundMatches[m], item.level.value);
					}
				} else {
					value = value.replaceAll(foundMatches[m], item.level);
				}
			} else {
				MapTool.chat.broadcast("Error! No match for " + splitStrings[0]);
			}
		}
		//MapTool.chat.broadcast(value);
		newValue = eval(value);
		//MapTool.chat.broadcast(String(newValue));
	}


	return newValue;
}

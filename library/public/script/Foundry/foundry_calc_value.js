"use strict";

function foundry_calc_value(value, actor, item) {
	let newValue = Number(value);
	if (isNaN(newValue)) {
		try {
			if (typeof (value) == "object") {
				if ("brackets" in value) {
					let splitVal = null;
					if ("field" in value) {
						let bracketSplit = value.field.split("|");
						if (bracketSplit[0] == "actor" && actor != null) {
							splitVal = actor.getProperty(bracketSplit[1]);
						} else if (bracketSplit[0] == "item" && item != null) {
							let searchVal = bracketSplit[1].split(".")[0];
							if (searchVal == "system") {
								searchVal = bracketSplit[1].split(".")[1];
							}
							if (searchVal in item) {
								splitVal = item[searchVal];
							}
						}
					}

					if (splitVal == null) {
						splitVal = Number(actor.getProperty("level"));
					}
					for (var s in value.brackets) {
						let startVal = 0;
						let endVal = 99;
						let bracket = value.brackets[s];
						if ("start" in bracket) {
							startVal = bracket.start;
						}
						if ("end" in bracket) {
							endVal = bracket.end;
						}
						if (splitVal >= startVal && splitVal <= endVal) {
							value = bracket.value;
							break;
						}
					}
				} else {
					return 0;
				}
			}
		} catch (e) {
			MapTool.chat.broadcast("Error in foundry_calc_value during nan-value");
			MapTool.chat.broadcast("value: " + JSON.stringify(value));
			MapTool.chat.broadcast("actor: " + JSON.stringify(actor));
			MapTool.chat.broadcast("item: " + JSON.stringify(item));
			MapTool.chat.broadcast("" + e + "\n" + e.stack);
			return;
		}
		if (!(isNaN(value))) {
			return value;
		}
		let foundMatches = value.match(/@[a-zA-Z\.]+/g);
		if (foundMatches != null) {
			for (var m in foundMatches) {
				let splitStrings = foundMatches[m].split(".");
				if (splitStrings[0] == "@actor") {
					if (actor == null) {
						MapTool.chat.broadcast("Error! No actor when parsing value " + value);
						return null;
					}
					value = value.replaceAll(foundMatches[m], actor.getProperty(splitStrings[1]));
				} else if (splitStrings[0] == "@item" && splitStrings[splitStrings.length - 1] == "value") {
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
					if (isNaN(Number(item.system.level))) {
						if ("value" in item.system.level) {
							value = value.replaceAll(foundMatches[m], item.system.level.value);
						}
					} else {
						value = value.replaceAll(foundMatches[m], item.system.level);
					}
				} else {
					MapTool.chat.broadcast("Error! No match for " + splitStrings[0]);
				}
			}
		} else {
			try {
				value = value.replace(/^{/, "").replace(/}$/, "");
				if (value.includes("flags")) {
					let splitStrings = value.split("|");
					let flagKey = splitStrings[splitStrings.length - 1];
					if (actor != null) {
						let testValue = get_actor_data(actor, flagKey);
						return testValue;
					}
				}
				return value;
			} catch (e) {
				MapTool.chat.broadcast("Error in foundry_calc_value during flag-check");
				MapTool.chat.broadcast("actor: " + String(actor));
				MapTool.chat.broadcast("value: " + JSON.stringify(value));
				MapTool.chat.broadcast("" + e + "\n" + e.stack);
				return;
			}
		}
		//MapTool.chat.broadcast(value);
		newValue = eval(value);
		//MapTool.chat.broadcast(String(newValue));
	}


	return newValue;
}

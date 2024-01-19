"use strict";

function read_hazard_properties(token){
	if (typeof(token)=="string"){
			token = MapTool.tokens.getTokenByID(token);
		if(token==null){
			MapTool.chat.broadcast("Couldn't find token!");
		}
	}

	let data = {"name":token.getName(),"maxHP":0,"ac":0,"saves":{"fortitude":0,"reflex":0,"will":0}};
	
	//__HEALTH__
	data.maxHP = token.getProperty("MaxHP");

	//__OFFENSE__
	data.basicAttacks = JSON.parse(token.getProperty("basicAttacks"));
	data.offensiveActions = JSON.parse(token.getProperty("offensiveActions"));

	//__DEFENSES__
	data.ac = token.getProperty("AC");
	for (var s in data.saves){
		data.saves[s] = token.getProperty(s);
	}

	data.weaknesses = JSON.parse(token.getProperty("weaknesses"));
	data.resistances = JSON.parse(token.getProperty("resistances"));
	data.immunities = JSON.parse(token.getProperty("immunities"));
	data.otherDefenses = JSON.parse(token.getProperty("otherDefenses"));
	data.passiveDefenses = JSON.parse(token.getProperty("passiveDefenses"));
    
	data.level = token.getProperty("level");
    data.stealth = JSON.parse(token.getProperty("stealth"));
    data.size = token.getProperty("size");
    data.disable = token.getProperty("disable");
    data.reset = token.getProperty("reset");
    data.routine = token.getProperty("routine");
    data.description = token.getProperty("description");
    data.isComplex = token.getProperty("isComplex");
    data.hardness = token.getProperty("hardness");
    data.traits = JSON.parse(token.getProperty("traits"));

	data.type = "hazard";

	return data;
}
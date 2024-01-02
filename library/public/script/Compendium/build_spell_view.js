"use strict";

function build_spell_view(spellName){
	//MapTool.chat.broadcast(spellName);
	//let libToken = get_runtime("libToken");
	//let property = JSON.parse(libToken.getProperty("pf2e_spell"));
	let property = JSON.parse(read_data("pf2e_spell"));

	if (!(spellName in property)){
		let remasterChanges = JSON.parse(read_data("remaster_changes")).spells;
		if(!spellName in remasterChanges){
			return "<h2>Could not find spell " + spellName + "</h2>";
		}else{
			if(remasterChanges[spellName] in property){
				spellName = remasterChanges[spellName];
			}else{
				return "<h2>Could not find spell " + remasterChanges[spellName] + "</h2>";
			}
		}
	}
	
	let spellData = property[spellName];
	if ("fileURL" in spellData){
		spellData = rest_call(spellData["fileURL"],"");
	}

	spellData = parse_spell(spellData);
	
	//MapTool.chat.broadcast(JSON.stringify(spellData));

	let HTMLString = "";

	HTMLString = HTMLString + "<h1 class='title'><span>" + spellData.name + "</span><span style='margin-left:auto; margin-right:0;'>" + capitalise(spellData.category) + " " + spellData.level + "</span></h1>";
	
	if(spellData.traits.rarity!="common"){
		HTMLString = HTMLString + "<span class='trait"+spellData.traits.rarity+"'>" + capitalise(spellData.traits.rarity) + "</span>";
	}
	for (var t in spellData.traits.value){
		HTMLString = HTMLString + "<span class='trait'>" + capitalise(spellData.traits.value[t]) + "</span>";
	}
	HTMLString = HTMLString + "<br />"
	HTMLString = HTMLString + "<b>Source </b><span class='ext-link'>" + spellData.publication.title + "</span><br />";
	if (spellData.traits.traditions.length>0){
		HTMLString = HTMLString + "<b>Traditions</b> " + capitalise(spellData.traits.traditions.join(", "));
		HTMLString = HTMLString + "<br />";
	}

	HTMLString = HTMLString + "<b>Cast</b> ";
	if(!isNaN(spellData.time)){
		HTMLString = HTMLString + icon_img(spellData.time+"action");
	}else if (spellData.time.includes("to")){
		let first = spellData.time.split(" to ")[0];
		let second = spellData.time.split(" to ")[1];
		if (isNaN(second)){
			HTMLString = HTMLString + icon_img(first+"action") + " to " + second;
		}else{
			HTMLString = HTMLString + icon_img(first+"action") + " to " + icon_img(second+"action");
		}
	}else if(spellData.time=="reaction"){
		HTMLString = HTMLString + icon_img("reaction");
	}else{
		HTMLString = HTMLString + spellData.time;
	}

	let components = [];
	for (var k in spellData.components){
		if (spellData.components[k]){
			components.push(k);
		}
	}
	HTMLString = HTMLString + " " + components.join(", ") + "<br />";

	if (spellData.area != null){
		HTMLString = HTMLString + "<b>Area</b> " + spellData.area.details + "; <b>Targets</b> " + spellData.target + "<br />";
	}

	if (spellData.spellType == "save" && spellData.save.value != ""){
		HTMLString = HTMLString + "<b>Saving Throw</b> ";
		if (spellData.save.basic == "basic"){
			HTMLString = HTMLString + "basic ";
		}
		HTMLString = HTMLString + capitalise(spellData.save.value);
	}
	if (spellData.spellType == "save" && spellData.save.value != "" && spellData.duration != null){
		HTMLString = HTMLString + "; ";
	}else if(spellData.spellType == "save" && spellData.save.value != ""){
		HTMLString = HTMLString + "<br />";
	}
	if (spellData.duration != null && spellData.duration != "" && spellData.duration.value !== "" && spellData.duration.value !== null){
		HTMLString = HTMLString + "<b>Duration</b> " + spellData.duration.value;
		HTMLString = HTMLString + "<br />";
	}
	
	HTMLString = HTMLString + "<hr />";

	HTMLString = HTMLString + clean_description(spellData.description, false, false, false);
	
		
	return HTMLString;

}

MTScript.registerMacro("ca.pf2e.build_spell_view", build_spell_view);
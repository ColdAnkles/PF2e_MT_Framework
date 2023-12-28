"use strict";

function parse_foundry_strings(foundryString){
	const bracketRegexp = /\[+(.*?\]?)\]/;
	const braceRegexp = /\]\{(.*?)\}/;

	//MapTool.chat.broadcast(foundryString);
	
	let bracketContents = foundryString.match(bracketRegexp);
	let braceContents = foundryString.match(braceRegexp);

	if(bracketContents!= null && bracketContents.length>1){
		bracketContents = bracketContents[1]
	}
	if(braceContents!= null && braceContents.length>1){
		braceContents = braceContents[1]
	}
	let returnData = {"bracketContents":bracketContents,"braceContents":braceContents,"bracketDetail":{}}
	for (var d in bracketContents.split("|")){
		let tempString = bracketContents.split("|")[d];
		let splitString = tempString.split(":")
		let key = splitString[0];
		let value = "";
		if (splitString.length>1){
			value = splitString.slice(1).join(":").split(',');
		}else{
			
		}
		returnData.bracketDetail[key]=value;
	}
	//MapTool.chat.broadcast(JSON.stringify(returnData));
	return returnData
}

function parse_template(templateString){
	let parsed = parse_foundry_strings(templateString);
	
	if(parsed.braceContents!=null){
		return parsed.braceContents;
	}else if(("type" in parsed.bracketDetail && "distance" in parsed.bracketDetail)){
		return + parsed.bracketDetail.distance.join(" ") + "-foot " + parsed.bracketDetail.type.join(", ");
	}
	
	return templateString;
}

function parse_damage(damageString){
	let parsed = parse_foundry_strings(damageString);
	
	return parsed.bracketContents.replaceAll(/\((.*)\)\[(.*)\]/gm,"$1 $2").replaceAll(/(.*)\[(.*)\]/gm,"$1 $2");
}

function parse_uuid(uuidString){
	let parsed = parse_foundry_strings(uuidString);

	//MapTool.chat.broadcast(JSON.stringify(parsed));
	
	if(parsed.braceContents!=null){
		return parsed.braceContents;
	}else if("Compendium.pf2e.bestiary-effects.Item.Effect" in parsed.bracketDetail){
		return "";
	}else if(parsed.bracketContents.includes("Spell Effect")){
		return "";
	}else{
		let tempArray = parsed.bracketContents.split(".");
		return tempArray[tempArray.length -1];
	}
	return uuidString;
	
}

function parse_check(checkString){
	let parsed = parse_foundry_strings(checkString);

	if(("type" in parsed.bracketDetail && "dc" in parsed.bracketDetail)){
		return "DC " + parsed.bracketDetail.dc.join(" ") + " " + parsed.bracketDetail.type.join(", ");
	}else if ("type" in parsed.bracketDetail){
		return parsed.bracketDetail.type.join(", ");
	}else{
		
	}
	return checkString;
}

function parse_localize(localizeString){
	//let parsed = parse_foundry_strings(localizeString);
	
	return "";
}

function parse_roll(rollString){
	//MapTool.chat.broadcast(rollString);
	let parsed = parse_foundry_strings(rollString);

	if(parsed.braceContents!=null){
		return parsed.braceContents;
	}else{
		return parsed.bracketContents.replace(/\/r ([0-9+ d]*).*/g,"$1")
	}
	
	return rollString;
}

function clean_description(description, removeLineBreaks = true, removeHR = true, removeP = true, rollDice = false){
	//MapTool.chat.broadcast(description.replaceAll("<","&lt;"));

	let cleanDescription = description;

	if (removeP){
		cleanDescription = cleanDescription.replaceAll("<p>","").replaceAll(".</p>",". ").replaceAll("</p>"," ");
	}else{
		cleanDescription = cleanDescription.replaceAll("<p>","").replaceAll(".</p>",".<br />").replaceAll("</p>","<br />");
	}
	if (removeLineBreaks){
		cleanDescription = cleanDescription.replaceAll("<br/>","").replaceAll(/\n/mg,"")
	}
	if (removeHR){
		cleanDescription = cleanDescription.replaceAll("<hr />","");
	}

	let template_matches = cleanDescription.match(/(@Template\[[^\[\]]*\])({[^\[\]]*})?/gm);
	for (var m in template_matches){
		let replaceString = parse_template(template_matches[m]);
		cleanDescription=cleanDescription.replaceAll(template_matches[m],replaceString);
	}

	let damage_matches = cleanDescription.match(/(@Damage\[.*?\]?\])({.*?})?/gm);
	for (var m in damage_matches){
		let replaceString = parse_damage(damage_matches[m]);
		cleanDescription=cleanDescription.replaceAll(damage_matches[m],replaceString);
	}

	let check_matches = cleanDescription.match(/(@Check\[[^\[\]]*\])({[^\[\]]*})?/gm);
	for (var m in check_matches){
		let replaceString = parse_check(check_matches[m]);
		cleanDescription=cleanDescription.replaceAll(check_matches[m],replaceString);
	}

	let uuid_matches = cleanDescription.match(/(@UUID\[[^\[\]]*\])({[^\[\]]*})?/gm);
	for (var m in uuid_matches){
		let replaceString = parse_uuid(uuid_matches[m]);
		cleanDescription=cleanDescription.replaceAll(uuid_matches[m],replaceString);
	}
	
	let localize_matches = cleanDescription.match(/@Localize\[.*\]/gm);
	for (var m in localize_matches){
		let replaceString = parse_localize(localize_matches[m]);
		cleanDescription=cleanDescription.replaceAll(localize_matches[m],replaceString);
	}

	let roll_matches = cleanDescription.match(/(\[+\/b?r.*?\]+)(\{.*?\})?/gm);
	for (var m in roll_matches){
		let replaceString = parse_roll(roll_matches[m]);
		cleanDescription=cleanDescription.replaceAll(roll_matches[m],replaceString);
	}

	cleanDescription = cleanDescription.replaceAll("emanation Aura","Aura");

	cleanDescription = cleanDescription.replaceAll("<span class=\"pf2-icon\">1</span>",icon_img("1action"));
	cleanDescription = cleanDescription.replaceAll("<span class=\"pf2-icon\">2</span>",icon_img("2action"));
	cleanDescription = cleanDescription.replaceAll("<span class=\"pf2-icon\">3</span>",icon_img("3action"));

	//MapTool.chat.broadcast(cleanDescription.replaceAll("<","&lt;"));

	return cleanDescription;
}


MTScript.registerMacro("ca.pf2e.clean_description", clean_description);
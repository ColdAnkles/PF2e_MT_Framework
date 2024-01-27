"use strict";

function parse_foundry_strings(foundryString){
	const bracketRegexp = /\[+(.*?\]?)\]+/;
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
	//MapTool.chat.broadcast(JSON.stringify(returnData));
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

function parse_damage(damageString, additionalData={"rollDice":false, "gm":false, "replaceGMRolls": true}){
	let parsed = parse_foundry_strings(damageString);
	if(additionalData.rollDice){
		let diceMatch = parsed.bracketContents.match(/([0-9d +-]*)/gm);
		if(diceMatch.length>0){
			diceMatch = diceMatch[0];
			let rolledDice = roll_dice(diceMatch);
			parsed.bracketContents = parsed.bracketContents.replace(diceMatch, diceMatch + " ("+String(rolledDice)+") ");
			return parsed.bracketContents.replaceAll(/\((.*)\)\[(.*)\]/gm,"$1 $2").replaceAll(/(.*)\[(.*)\]/gm,"$1 $2");
		}else{
			return parsed.bracketContents.replaceAll(/\((.*)\)\[(.*)\]/gm,"$1 $2").replaceAll(/(.*)\[(.*)\]/gm,"$1 $2");
		}
	}else{	
		return parsed.bracketContents.replaceAll(/\((.*)\)\[(.*)\]/gm,"$1 $2").replaceAll(/(.*)\[(.*)\]/gm,"$1 $2");
	}
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

function parse_roll(rollString, additionalData={"rollDice":false, "gm":false, "replaceGMRolls": true}){
	MapTool.chat.broadcast(rollString);
	if(rollString.includes("/br") || (!(rollString.includes("(")) || !(rollString.includes(")")))){
		//MapTool.chat.broadcast("Case One");
		let parsed = parse_foundry_strings(rollString);
		//MapTool.chat.broadcast(JSON.stringify(parsed));
		if(parsed.braceContents!=null){
			if(additionalData.rollDice){
				let diceMatch = parsed.braceContents.match(/([0-9+ d-]*)/g);
				//MapTool.chat.broadcast(JSON.stringify(diceMatch));
				if(diceMatch.length>0){
					diceMatch = diceMatch[0].replaceAll("/r ","").replaceAll("/r","");
					let rolledDice = roll_dice(diceMatch);
					let replaceString = "";
					if (diceMatch.includes("d") && rollString.includes("/r")){
						replaceString = diceMatch + " (" + String(rolledDice) + ") ";
					}else if (diceMatch.includes("d") && rollString.includes("/br") && !additionalData.gm){
						if(additionalData.replaceGMRolls){
							replaceString = diceMatch;
						}else{
							return rollString;
						}
					}else if (diceMatch.includes("d") && rollString.includes("/br") && additionalData.gm){
						replaceString = diceMatch + " (" + String(rolledDice) + ") ";
					}else{
						replaceString = diceMatch;
					}
					return parsed.braceContents.replace(diceMatch, replaceString);
				}else{
					return parsed.braceContents;
				}
			}else{
				return parsed.braceContents;
			}
		}else{
			if(additionalData.rollDice){
				let diceMatch = parsed.bracketContents.match(/\/r ([0-9+ d-]*).*/g);
				//MapTool.chat.broadcast(JSON.stringify(diceMatch));
				if(diceMatch.length>0){
					diceMatch = diceMatch[0].replaceAll("/r ","").replaceAll("/r","");
					let replaceString = "";
					if (diceMatch.includes("d")){
						replaceString = "[r: " + diceMatch + "]";
					}else{
						replaceString = diceMatch;
					}
					return parsed.braceContents.replace(diceMatch, replaceString);
				}else{
					return parsed.braceContents;
				}
			}else{
				return parsed.bracketContents.replace(/\/r ([0-9+ d-]*).*/g,"$1");
			}
		}
	}else{
		const rollRegexp = /\([^[\]]*\)/g;
		const infoRegexp = /\[([^[\]]*)\]/g;
		let rollMatch = [...rollString.matchAll(rollRegexp)];
		let infoMatch = [...rollString.matchAll(infoRegexp)];
		//MapTool.chat.broadcast("Case Two");
		//MapTool.chat.broadcast(rollString);
		//MapTool.chat.broadcast(JSON.stringify(rollMatch));
		//MapTool.chat.broadcast(JSON.stringify(infoMatch));
		if (rollMatch!=null && rollMatch.length>0){
			rollMatch = rollMatch[rollMatch.length-1];
		}
		if (infoMatch!=null && infoMatch.length>0){
			infoMatch = infoMatch[infoMatch.length-1];
		}
		if (rollMatch!=null && rollMatch.length>0){
			rollMatch = rollMatch[rollMatch.length-1];
		}
		if (infoMatch!=null && infoMatch.length>0){
			infoMatch = infoMatch[infoMatch.length-1];
		}

		if (rollMatch.includes("@level") && "level" in additionalData){
			rollMatch = rollMatch.replaceAll("@level", String(additionalData.level));
		}else if (rollMatch.includes("@item.level") && "level" in additionalData){
			rollMatch = rollMatch.replaceAll("@item.level", String(additionalData.level));
		}

		if(additionalData.rollDice || !(rollMatch.includes("d"))){
			rollMatch = String(eval(rollMatch));
		}

		//MapTool.chat.broadcast(rollMatch);
		//MapTool.chat.broadcast(infoMatch);
	
		return rollMatch + " " + infoMatch.replaceAll(","," ");
	}

	return rollString;
}

function clean_calculations(calculationString, additionalData={"rollDice":false, "gm":false, "replaceGMRolls": true}){
	//MapTool.chat.broadcast(calculationString);
	if (calculationString.includes("@level") && "level" in additionalData){
		calculationString = calculationString.replaceAll("@level", String(additionalData.level));
	}else if (calculationString.includes("@item.level") && "level" in additionalData){
		calculationString = calculationString.replaceAll("@item.level", String(additionalData.level));
	}
	return String(eval(calculationString));
}

function clean_description(description, removeLineBreaks = true, removeHR = true, removeP = true, additionalData = {"rollDice":false, "gm":false, "replaceGMRolls": true}){
	//MapTool.chat.broadcast(description.replaceAll("<","&lt;"));

	let cleanDescription = description;

	cleanDescription = cleanDescription.replaceAll("<span class=\"action-glyph\">1</span>",icon_img("1action", true));
	cleanDescription = cleanDescription.replaceAll("<span class=\"action-glyph\">2</span>",icon_img("2action", true));
	cleanDescription = cleanDescription.replaceAll("<span class=\"action-glyph\">3</span>",icon_img("3action", true));

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
		let replaceString = parse_damage(damage_matches[m], additionalData);
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
		let replaceString = parse_roll(roll_matches[m], additionalData);
		cleanDescription=cleanDescription.replaceAll(roll_matches[m],replaceString);
	}

	let calculation_matches = cleanDescription.match(/((floor|ceil|max|min)\(.*\))/gm);
	for (var m in calculation_matches){
		let replaceString = clean_calculations(calculation_matches[m], additionalData);
		cleanDescription=cleanDescription.replaceAll(calculation_matches[m],replaceString);
	}


	cleanDescription = cleanDescription.replaceAll("emanation Aura","Aura");

	cleanDescription = cleanDescription.replaceAll("<span class=\"pf2-icon\">1</span>",icon_img("1action"));
	cleanDescription = cleanDescription.replaceAll("<span class=\"pf2-icon\">2</span>",icon_img("2action"));
	cleanDescription = cleanDescription.replaceAll("<span class=\"pf2-icon\">3</span>",icon_img("3action"));

	//MapTool.chat.broadcast(cleanDescription.replaceAll("<","&lt;"));

	return cleanDescription;
}


MTScript.registerMacro("ca.pf2e.clean_description", clean_description);
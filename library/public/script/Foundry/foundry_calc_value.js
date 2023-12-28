"use strict";

function max(a, b){
	return Math.max(a,b);
}

function min(a, b){
	return Math.min(a,b);
}

function foundry_calc_value(value, actor, item){
		let newValue = Number(value);
		if (isNaN(newValue)){
			//MapTool.chat.broadcast(value);
			let foundMatches = value.match(/@[a-zA-Z\.]+/g);
			for(var m in foundMatches){
				//MapTool.chat.broadcast(String(foundMatches[m]));
				let splitStrings = foundMatches[m].split(".");
				if(splitStrings[0]=="@actor"){
					if(actor==null){
						MapTool.chat.broadcast("Error! No actor when parsing value " + value);
						return null;
					}
					value = value.replaceAll(foundMatches[m],actor.getProperty(splitStrings[1]));
				}else if(splitStrings[0]=="@item"){
					if (item==null){
						MapTool.chat.broadcast("Error! No item when parsing value " + value);
						return null;
					}
					if(isNaN(Number(item.value))){
						if("value" in item.value){
							value = value.replaceAll(foundMatches[m],item.value.value);
						}
					}else{
						value = value.replaceAll(foundMatches[m],item.value);
					}
				}else{
					MapTool.chat.broadcast("Error! No match for " + splitStrings[0]);
				}
			}
			//MapTool.chat.broadcast(value);
			newValue = eval(value);
		}


		return newValue;
}

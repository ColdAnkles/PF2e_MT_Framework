"use strict";

function icon_img(imageType, invert=false, srcLocOnly=false){
	//MapTool.chat.broadcast(imageType);
	let tokenName = "";
	let imageSize = 18;
	if (imageType == "1action"){
		tokenName = "Image:SingleAction";
	}else if (imageType == "2action"){
		tokenName = "Image:TwoActionActivity";
		imageSize += 4;
	}else if (imageType == "3action"){
		tokenName = "Image:ThreeActionActivity";
		imageSize += 8;
	}else if (imageType.includes("freeAction")){
		tokenName = "Image:FreeAction";
	}else if (imageType.includes("reaction")){
		tokenName = "Image:Reaction";
	}else if (imageType.includes("passive")){
		return "";
	}else if (imageType=="melee"){
		tokenName = "Image:Melee";
	}else if (imageType=="ranged"){
		tokenName = "Image:Ranged";
	}else{
		return "<b>NO IMAGE</b>";
	}
	if (invert){
		tokenName = tokenName+"W";
	}
	MTScript.setVariable("tokenName", tokenName);
	MTScript.setVariable("imageSize", imageSize);
	MTScript.evalMacro("[h: img = getImage(tokenName, imageSize)]");
	let image = MTScript.getVariable("img");
	let returnText = "<img src='" + image + "'></img>";
	if (srcLocOnly){
		returnText = image;
	}

	return returnText;
}


MTScript.registerMacro("ca.pf2e.icon_img", icon_img);
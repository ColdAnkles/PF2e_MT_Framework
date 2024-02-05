"use strict";

function icon_img(imageName, invert=false, srcLocOnly=false){
	//MapTool.chat.broadcast(imageName);

	let imageDict = JSON.parse(read_data("image_dict"));
	//MapTool.chat.broadcast(JSON.stringify(imageDict));
	let imageSizeH = 18;
	let imageSizeW = 18;
	if (imageName == "1action"){
	}else if (imageName == "2action"){
		imageSizeW += 10;
	}else if (imageName == "3action"){
		imageSizeW += 18;
	}else if (imageName.includes("freeAction") || imageName == "free"){
		imageName = "freeAction";
	}else if (imageName.includes("reaction")){
		imageName = "reaction";
	}else if (imageName.includes("passive")){
		return "";
	}else if (imageName=="melee"){
		//Nothing
	}else if (imageName=="ranged"){
		//Nothing
	}else{
		return "<b>NO IMAGE</b>";
	}
	if (invert){
		imageName = imageName+"W";
	}else{
		imageName = imageName+"B";
	}
	//MapTool.chat.broadcast(imageName);
	//MTScript.setVariable("imageName", imageName);
	//MTScript.setVariable("imageSize", imageSize);
	//MTScript.evalMacro("[h: img = getImage(imageName, imageSize)]");
	let assetString = imageDict[imageName];
	let returnText = "<img src='" + assetString + "' width='"+String(imageSizeW)+"' height='"+String(imageSizeH)+"'></img>";
	//MapTool.chat.broadcast(assetString);
	if (srcLocOnly){
		returnText = assetString;
	}

	return returnText;
}


MTScript.registerMacro("ca.pf2e.icon_img", icon_img);
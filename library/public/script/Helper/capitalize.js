function capitalise(aString){
	if(aString=="" || aString==null){
		return "";
	}
	let words = aString.split(" ");
	return words.map((word) => { 
    	return word[0].toUpperCase() + word.substring(1);
    }).join(" ");
}

MTScript.registerMacro("ca.pf2e.capitalise", capitalise);
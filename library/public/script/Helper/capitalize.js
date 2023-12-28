function capitalize(aString){
	let words = aString.split(" ");
	return words.map((word) => { 
    	return word[0].toUpperCase() + word.substring(1);
    }).join(" ");
}

MTScript.registerMacro("ca.pf2e.capitalize", capitalize);
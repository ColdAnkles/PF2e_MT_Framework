"use strict";

function pos_neg_sign(number, space=false){
	if (number<0){
		if(space){
			return "- " + String(Math.abs(number));
		}else{
			return "-" + String(Math.abs(number));
		}
	}else{
		if(space){
			return "+ " + String(number);
		}else{
			return "+" + String(number);
		}
	}
}

MTScript.registerMacro("ca.pf2e.pos_neg_sign", pos_neg_sign);
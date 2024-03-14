[h: oldData = json.get(macro.args,"old")]
[h: newData = json.get(macro.args,"new")]

[h: nextRound = json.get(oldData, "round")<json.get(newData,"round")]
[h, if(nextRound), code:{
	[h, if(ca.pf2e.isLibraryLoaded("Lib:DateTime")), code:{
		[h: arguments = json.set("{}","Advance","Advance","selectedNumber",6,"numberType","Seconds")]
		[h, MACRO("AdvanceTime@Lib:DateTime"):arguments]
	};{}]
	[h: js.ca.pf2e.on_round_begin()]
};{}]

[h: js.ca.pf2e.on_turn_begin(json.get(newData,"token"), newData)]
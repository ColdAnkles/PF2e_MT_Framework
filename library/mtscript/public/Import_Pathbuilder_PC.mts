[h: existingID = macro.args]
[h: ans = input("pbID||Pathbuilder JSON ID|TEXT")]
[h: abort(ans)]
[h, if(existingID==""), code:{
	[r: ca.pf2e.Spawn_PC_Lib(pbID)]
};{
	[r: ca.pf2e.Update_PC_Lib(json.set("{}","pbID",pbID,"tokenID",existingID))]
}]
[h, if(isFrameVisible("Compendium")), code:{
	[h: ca.pf2e.Compendium_Home()]
};{}]
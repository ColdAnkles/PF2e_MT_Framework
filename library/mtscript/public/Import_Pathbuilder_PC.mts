[h: existingID = macro.args]
[h: ans = input("pbID||Pathbuilder JSON ID|TEXT")]
[h: abort(ans)]
[h, if(existingID==""), code:{
	[r: pf2e.Spawn_PC_Lib(pbID)]
};{
	[r: pf2e.Update_PC_Lib(json.set("{}","pbID",pbID,"tokenID",existingID))]
}]

[h: sourceData = js.ca.pz2e.get_foundry_sources()]
[h: setLibProperty("foundrySourceData", sourceData)]
[h, foreach(s,sourceData), code:{
	[h: broadcast(s)]
}]
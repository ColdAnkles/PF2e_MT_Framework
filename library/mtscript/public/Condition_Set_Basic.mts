[h: condition = json.get(macro.args,0)]
[h: ids = getSelected()]
[h, foreach(id, ids,""), code:{
	[h: ca.pf2e.Condition_Set_Query(condition, id)]
}]

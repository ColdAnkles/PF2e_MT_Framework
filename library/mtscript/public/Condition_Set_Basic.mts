[h: condition = json.get(macro.args,0)]
[h: ids = getSelected()]
[h, foreach(id, ids,""), code:{
    [h: testMatch = matches(getName(id), "Lib:.*")]
	[h, if(isPC(id) && !testMatch), code:{
		[h: id = getProperty("myID", id)]
	};{
        [h: id = id]
    }]
	[h: ca.pf2e.Condition_Set_Query(condition, id)]
}]

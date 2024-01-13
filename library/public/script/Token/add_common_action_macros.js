"use strict";

function add_common_action_macros(tokenID){
	add_action_to_token({"name":"Stride","type":"basic","group":"Movement"},tokenID)
	add_action_to_token({"name":"Climb","type":"basic","group":"Movement"},tokenID)
	//add_action_to_token({"name":"Balance","type":"basic","group":"Movement"},tokenID)
	//add_action_to_token({"name":"Crawl","type":"basic","group":"Movement"},tokenID)
	//add_action_to_token({"name":"Drop Prone","type":"basic","group":"Movement"},tokenID)
	//add_action_to_token({"name":"High Jump","type":"basic","group":"Movement"},tokenID)
	//add_action_to_token({"name":"Leap","type":"basic","group":"Movement"},tokenID)
	//add_action_to_token({"name":"Long Jump","type":"basic","group":"Movement"},tokenID)
	//add_action_to_token({"name":"Sneak","type":"basic","group":"Movement"},tokenID)
	//add_action_to_token({"name":"Squeeze","type":"basic","group":"Movement"},tokenID)
	add_action_to_token({"name":"Stand","type":"basic","group":"Movement"},tokenID)
	//add_action_to_token({"name":"Step","type":"basic","group":"Movement"},tokenID)
	//add_action_to_token({"name":"Swim","type":"basic","group":"Movement"},tokenID)
	//add_action_to_token({"name":"Track","type":"basic","group":"Movement"},tokenID)
	add_action_to_token({"name":"Tumble Through","type":"basic","group":"Movement"},tokenID)

}

MTScript.registerMacro("ca.pf2e.add_common_action_macros", add_common_action_macros);
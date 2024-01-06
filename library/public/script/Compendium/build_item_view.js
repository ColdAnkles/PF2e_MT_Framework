"use strict";

function build_item_view(itemName){
    let property = JSON.parse(read_data("pf2e_item"));
    let itemData = property[itemName];
    if ("fileURL" in itemData){
		itemData = rest_call(itemData["fileURL"],"");
	}
    itemData = parse_feature(itemData, null);
    return JSON.stringify(itemData);
}

MTScript.registerMacro("ca.pf2e.build_item_view", build_item_view);
[h, if(json.type(macro.args)=="ARRAY"), code:{
	[h: macro.args = json.get(macro.args,0)]
};{}]
[h: itemName=json.get(macro.args,"itemName")]
[h: itemType=json.get(macro.args,"itemType")]
[h: itemData=json.get(macro.args,"itemData")]

[r, frame5(itemName, "width=1000; height=700; temporary=1; noframe=0; input=1"):{
    [h: cssName = "lib://ca.pz2e/css/" + json.get(json.get(getLibProperty("pz2e_themes","Lib:ca.pz2e"), getLibProperty("selectedTheme","Lib:ca.pz2e")),"css")]
	<link rel="stylesheet" type="text/css" href=[r:cssName]>

<body>
[r, if(itemType=="hazard"), code:{
    <p>[r: js.ca.pz2e.build_hazard_view(itemName)]</p>
};{}]
[r, if(itemType!="hazard" && itemData == "null"), code:{
    <p>[r: js.ca.pz2e.build_item_view(itemType, itemName)]</p>
};{}]
[r, if(itemType!="hazard" && itemData != "null"), code:{
    <p>[r: js.ca.pz2e.build_item_view(itemType, itemName, itemData)]</p>
};{}]
</body>
}]
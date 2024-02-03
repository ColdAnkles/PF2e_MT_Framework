[h: itemName=json.get(macro.args,"itemName")]
[h: itemType=json.get(macro.args,"itemType")]

[frame5(itemName, "width=1000; height=700; temporary=1; noframe=0; input=1"):{

<link rel="stylesheet" type="text/css" href="lib://ca.pf2e/css/NethysCSS.css"/>

<body>
[r, if(itemType=="hazard"), code:{
    <p>[js.ca.pf2e.build_hazard_view(itemName)]</p>
};{
    <p>[js.ca.pf2e.build_item_view(itemType, itemName)]</p>
}]
</body>
}]
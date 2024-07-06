[h: movedToken = currentToken()]
[h: vis =  isFrameVisible(getName(movedToken) + "\'s Inventory")]
[h, if(vis), code:{
    [h: js.ca.pf2e.view_inventory(movedToken)]
};{}]
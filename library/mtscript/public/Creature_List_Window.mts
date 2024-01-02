[h,if(macro.args==""):sort="name";sort=getStrProp(macro.args,"sort")]
[h,if(macro.args==""):dir="a";dir=getStrProp(macro.args,"dir")]

[h: rollNPC = 0 ]

[h,if(rollNPC==1):output=if(isGM()==1,outputGM,outputPC);output="none"]

[dialog5("Creature List", "width=900; height=600; temporary=1; noframe=0; input=1"):{
	[r: js.ca.pf2e.build_creature_list(sort, dir)]
}]
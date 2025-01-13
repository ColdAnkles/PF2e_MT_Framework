[frame5("Welcome", "width=1000; height=700; temporary=0; noframe=0; input=1"):{
<html>
    <head>
    [h: cssName = "lib://ca.pf2e/css/" + json.get(json.get(getLibProperty("pf2e_themes","Lib:ca.pf2e"), getLibProperty("selectedTheme","Lib:ca.pf2e")),"css")]
	<link rel="stylesheet" type="text/css" href=[r:cssName]>
    </head>
    <body>
        <h1 class='title'>Welcome!</h1>
        <p>Welcome to my Pathfinder 2e Framework! Based on the most excellent work of the PF2e Foundry Developers!</p>
        <p><b>Important</b>: You and all players must enable External Macro Access via "Edit -> Preferences -> Application Tab -> Macro Permissions Section -> Enable External Macro Access"</p>
        <h2 class='title'>Player Characters</h2>
        <p>Adding Player Characters can be imported from Pathbuilder via the link in the Compendium. When imported, a PC Lib token will be placed on the "Player Characters" map. This token stores all data for the player token, but can be freely viewed and reimported via the compendium links. Player should be able to import their own PC themselves, and the resulting token should have ownership set as expected. The one thing to note about token imports from Pathbuilder: Some "Features" according to Pathbuilder aren&#39;t "Features" in Foundry&#39;s data set. You&#39;ll get a warning when importing a character - any class features, special unarmed attacks, or custom content is fine to ignore.</p>
        <p>To spawn the PC Party on another map, for use in an encounter, make use of the GM Macro "Spawn PC Party" which will spawn interactable tokens for each PC.</p>
        <p>Alternatively, the "Create Simple Token" link can be used to create a simple PC that does not make use of the fancy features of the framework. Intended for tracking HP, conditions, and position only.</p>
        <h2 class='title'>Things This Framework Does Not Do</h2>
        <p>Some conditional modifers are not calculated - like "+2 Circumstance Bonus to Reflex DC against Trip" or similar.</p>
        <p>Actions like "Quickened Casting" do not discount actions on the next spell used. Use the "Refund Action" macro to regain actions as necessary.</p>
        <p>Abilities/Actions that manipulate MAP do not work automatically. You will need to use one of your "Strike" macros and set the "Use MAP", "Increase MAP", and "Spend Action" options as necessary, then afterwards use the "Increase MAP" macro.</p>
    </body>
</html>
}]
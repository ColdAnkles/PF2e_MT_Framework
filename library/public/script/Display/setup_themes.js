"use strict";

function setup_themes() {
    MTScript.evalMacro("[h: output = library.getContents('ca.pf2e')]")
    let libContents = JSON.parse(MTScript.getVariable("output"));
    let themes = {};
    for (var file in libContents) {
        let fileName = libContents[file];
        if (fileName.includes("/themes/")) {
            MTScript.setVariable("item", fileName);
            MTScript.evalMacro("[h: importData = data.getStaticData('ca.pf2e', item)]");
            let importData = JSON.parse(MTScript.getVariable("importData"));
            themes[importData.themeName] = importData;
        }
    }
    write_data("pf2e_themes", themes);
}

MTScript.registerMacro("ca.pf2e.setup_themes", setup_themes);
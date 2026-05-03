"use strict";

function setup_themes() {
    MTScript.evalMacro("[h: output = library.getContents('ca.pz2e')]")
    let libContents = JSON.parse(MTScript.getVariable("output"));
    let themes = {};
    for (var file in libContents) {
        let fileName = libContents[file];
        if (fileName.includes("/themes/")) {
            MTScript.setVariable("item", fileName);
            MTScript.evalMacro("[h: importData = data.getStaticData('ca.pz2e', item)]");
            let importData = JSON.parse(MTScript.getVariable("importData"));
            themes[importData.themeName] = importData;
        }
    }
    write_data("pz2e_themes", themes);
}

MTScript.registerMacro("ca.pz2e.setup_themes", setup_themes);
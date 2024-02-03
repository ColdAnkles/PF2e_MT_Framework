[h: libContents = library.getContents("ca.pf2e")]
[h, foreach(item, libContents), code:{
    [h: jsonMatch = matches(item, ".*data\/.*\.json")]
    [h, if(jsonMatch), code:{
        [h: importData = data.getStaticData('ca.pf2e', item)]
        [h: id = strfind(item, "/([^/]*)\$")]
        [h: fileName = getGroup(id, 1, 1)]
        [h: id = strFind(fileName, "[^.]*")]
        [h: varName = getGroup(id, 1, 0)]
        [h: setLibProperty(varName, importData, 'Lib:ca.pf2e')]
    };{}]
}]
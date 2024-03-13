[h: testLibName = json.get(macro.args,0)]
[h: loadedLibs = library.listAddOnLibraries()]
[h, foreach(lib, loadedLibs, ""), code:{
    [h: loadedName = json.get(lib, "name")]
    [h, if(loadedName == testLibName), code:{
        [h: return(0, true)]
    }]
}]
[h: return(0, false)]
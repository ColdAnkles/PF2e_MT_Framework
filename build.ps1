param (
    [Parameter(Mandatory)][ValidateSet("simple", "all")][string] $build
)

if($build -eq "all"){
    .\prep-content.ps1 pf2e all
    .\prep-content.ps1 sf2e source
    .\prep-content.ps1 sf2e import
}

if ($build -eq "simple" -or $build -eq "all"){
    #Remove Old Libs
    Remove-Item PF2e_MT_Framework.mtlib
    Remove-Item SF2e_MT_Framework.mtlib

    #Copy PF2E Data Files, Make Lib, Remove Data Files
    Copy-Item -Recurse -Path pf2e_data -Destination library/public
    Rename-Item -Path library/public/pf2e_data -NewName data
    Write-Output "pf2e" | Out-File library/public/data/system.txt -Force -NoNewline
    7z a -tzip PF2e_MT_Framework.mtlib '@.vscode/listfile.txt'
    Remove-Item -Recurse -Force -Path library/public/data

    #Copy SF2E Data Files, Make Lib, Remove Data Files
    Copy-Item -Recurse -Path sf2e_data -Destination library/public
    Rename-Item -Path library/public/sf2e_data -NewName data
    Write-Output "sf2e" | Out-File library/public/data/system.txt -Force -NoNewline
    7z a -tzip SF2e_MT_Framework.mtlib '@.vscode/listfile.txt'
    Remove-Item -Recurse -Force -Path library/public/data

    Write-Host "Build Completed"
}
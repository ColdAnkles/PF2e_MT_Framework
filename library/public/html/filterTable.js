function filterTable() {
    // Declare variables
    var minLevel, maxLevel, filter, table, txtValue, levelvalue, sourcetxt;
    filter = document.getElementById("filterText").value.toUpperCase();
    minLevel = document.getElementById("minLevel").value;
    maxLevel = document.getElementById("maxLevel").value;
    if (minLevel === "") { minLevel = -100; }
    if (maxLevel === "") { maxLevel = 100; }
    table = document.getElementById("filterTable");

    // Loop through all table rows, and hide those who don't match the search query
    for (let row of table.rows) {
        if (row.cells[0].id == "") {
            continue;
        }
        txtValue = row.cells[0].innerText;
        sourcetxt = row.cells[5].innerText;
        levelvalue = Number(row.cells[4].innerText);
        if (((txtValue.toUpperCase().indexOf(filter) > -1) || (sourcetxt.toUpperCase().indexOf(filter) > -1)) && (levelvalue >= minLevel && levelvalue <= maxLevel)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    }
    return;
}
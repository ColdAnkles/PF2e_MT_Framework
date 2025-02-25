function filterTable() {
    // Declare variables
    var minLevel, maxLevel, filter, table, txtValue, levelvalue, sourcetxt;
    filter = document.getElementById("filterText").value.toUpperCase();
    minLevel = document.getElementById("minLevel");
    maxLevel = document.getElementById("maxLevel");

    if (minLevel != null) { minLevel = minLevel.value } else {minLevel = -100};
    if (maxLevel != null) { maxLevel = maxLevel.value } else {maxLevel = 100};

    if (minLevel === "") { minLevel = -100; }
    if (maxLevel === "") { maxLevel = 100; }
    table = document.getElementById("filterTable");

    let even = true;
    // Loop through all table rows, and hide those who don't match the search query
    for (let row of table.rows) {
        if (row.cells[0].id == "") {
            continue;
        }
        txtValue = row.cells[0].innerText;
        if (row.cells.length > 5) {
            sourcetxt = row.cells[5].innerText;
        } else {
            sourcetxt = "";
        }
        if (row.cells.length > 4 && !isNaN(row.cells[4].innerText)) {
            levelvalue = Number(row.cells[4].innerText);
        } else {
            levelvalue = "0";
        }
        if (((txtValue.toUpperCase().indexOf(filter) > -1) || (sourcetxt.toUpperCase().indexOf(filter) > -1)) && (levelvalue >= minLevel && levelvalue <= maxLevel)) {
            row.style.display = "";
            if (even) {
                row.classList.remove("oddRow");
                row.classList.add("evenRow");
            } else {
                row.classList.add("oddRow");
                row.classList.remove("evenRow");
            }
            even = !even
        } else {
            row.style.display = "none";
        }
    }
    return;
}
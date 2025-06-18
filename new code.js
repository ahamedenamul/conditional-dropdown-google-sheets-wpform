<script>
document.addEventListener('DOMContentLoaded', function () {
    const sheetURL = "https://docs.google.com/spreadsheets/d/1yfUjJ54lz6RnSC3z9siKJ6IJkRIoXpJo5WMaNES41xc/gviz/tq?tqx=out:json";

    const firstDropdown = document.getElementById("wpforms-555-field_5");
    const secondDropdown = document.getElementById("wpforms-555-field_10");
    const secondDropdownContainer = document.getElementById("wpforms-555-field_10-container");

    secondDropdownContainer.style.display = "none";

    const firstChoices = firstDropdown.choices || new Choices(firstDropdown, {
        searchEnabled: false,
        itemSelectText: '',
        shouldSort: false
    });

    const secondChoices = secondDropdown.choices || new Choices(secondDropdown, {
        searchEnabled: false,
        itemSelectText: '',
        shouldSort: false
    });

    let rows = [];

    function formatCellValue(cell) {
    if (!cell) return '';            
    if (cell.f !== undefined) return cell.f;  
    return cell.v !== undefined ? cell.v : ''; 
}

fetch(sheetURL)
    .then(response => response.text())
    .then(data => {
        const json = JSON.parse(data.substring(47).slice(0, -2));
        rows = json.table.rows;

        // Populate first dropdown with Column A values
        const firstOptions = rows
            .filter(row => row.c[0] && row.c[0].v)
            .map((row, index) => ({
                value: index, // Use row index as value
                label: formatCellValue(row.c[0])
            }));

        firstChoices.clearChoices();
        firstChoices.setChoices(firstOptions, 'value', 'label', true);
    })
    .catch(error => console.error("Error loading Google Sheet data:", error));

firstDropdown.addEventListener("change", function () {
    const selectedRowIndex = parseInt(firstDropdown.value);

    if (!isNaN(selectedRowIndex)) {
        const startCol = 1;
        const endCol = 10;
        const secondOptions = [];

        for (let col = startCol; col <= endCol; col++) {
            const cell = rows[selectedRowIndex]?.c[col];
            const value = formatCellValue(cell);
            if (value) {
                secondOptions.push({ value: value, label: value });
            }
        }

        secondChoices.clearChoices();
        secondChoices.setChoices(secondOptions, 'value', 'label', true);
        secondDropdownContainer.style.display = "block";
    } else {
        secondDropdownContainer.style.display = "none";
        secondChoices.clearChoices();
    }
});
});
</script>

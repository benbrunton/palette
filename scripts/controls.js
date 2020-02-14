export function addPicker(parent, onChange) {
    const input = document.createElement("input");
    input.type = "color";
    input.addEventListener("change", onChange);

    parent.appendChild(input);
}

export function getColoursFromPickers(parentNode) {
    let pickers = [].slice.call(
        parentNode.childNodes
    );

    return pickers.map(picker => {
        return picker.value
    });
}

export function getColoursFromQueryString(cols) {
    let urlParams = new URLSearchParams(window.location.search);
    if(urlParams.has("col")){
        cols = urlParams.get("col").split(",");
    }
    return cols;
}



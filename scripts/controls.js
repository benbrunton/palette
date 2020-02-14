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



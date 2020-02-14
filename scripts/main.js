import { updateCanvases,applyFavicon } from './golden-ratio-canvas.js';
import {
    hexToHSL,
    HSLToHex,
    generateColourList,
    findEveryPermutation
} from './colours.js';
import {
    addPicker,
    getColoursFromPickers,
    getColoursFromQueryString,
} from './controls.js';

const canvasHolder = document.getElementById("canvas");
const addColours = document.getElementById("add-colour-pickers");
const removeColours = document.getElementById(
    "remove-colour-pickers"
);
const colourPickers = document.getElementById("colour-pickers");
const derivePalette = document.getElementById(
    "derive-palette"
);

addColours.addEventListener("click", () => {
    addPicker(colourPickers, applyColours);
    applyColours();
});

removeColours.addEventListener("click", () => {
    let lastPicker = colourPickers.lastChild;
    if(!lastPicker){
        return;
    }

    colourPickers.removeChild(lastPicker);
    applyColours();
});

derivePalette.addEventListener("click", () => {
    const n = colourPickers.childNodes.length;
    const colourList = generateColourList(n);
    reorderColours(colourList);
});


function applyColours(){
    let colours = getColoursFromPickers(colourPickers);
    let colourPerms = findEveryPermutation(colours);

    applyFavicon(colours); 
    updateCanvases(canvasHolder, colourPerms, reorderColours);
    history.pushState(
        null, "", "?col=" + colours
            .map(encodeURIComponent).join(",")
    );

}


function reorderColours(colourList) {
    for(let i = 0; i < colourPickers.childNodes.length; i++ ) {
        colourPickers.childNodes[i].value = colourList[i];
    }
    applyColours();
}


const defaultPalette = ["#ffffff", "#FF0000", "#000000"];
const cols = getColoursFromQueryString(defaultPalette);
cols.forEach(() => {addPicker(colourPickers, applyColours)});
reorderColours(cols);
applyColours();


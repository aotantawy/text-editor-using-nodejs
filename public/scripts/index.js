function countText(selector, documentLength) {
    selector.attr("value", "" + documentLength);
}

function addNewLine(document, documentLength) {
    if (documentLength % 100 === 0) {
        document.value += "\n";
    }
}

$(".file-content").on("input", function () {
    let documentLength = this.value.length;
    addNewLine(this, documentLength);
    countText($(".text-counter"), documentLength);
});

// to handle the paste text and formate it to be normal text

$(".file-content").on("paste", function () {
    setTimeout(() => {
        if (this.value <= 100) { // in case of pasted string less that 100 then do not make any action 
            return;
        }
        let pastedValue = this.value.replace(/[\r\n]/g, '');
        let pastedValueLength = this.value.length;
        let startindex = 0;
        let newString = "";
        for (let i = 0; i < pastedValueLength; i++) {
            if (i % 100 === 0) {
                newString += pastedValue.substring(startindex, i);
                newString += "\n";
                startindex = i;
            }
        }
        this.value = newString;
    }, 100);
})

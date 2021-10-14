const escape = document.createElement("textarea");

function escapeHTML(text) {
    escape.innerText = text;
    return escape.innerHTML;
}

const Base64 = {
    encode(str) {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
            function toSolidBytes(match, p1) {
                return String.fromCharCode('0x'+p1)
            }))
    },

    encodeArrayBuffer(buffer) {
        return new Promise(resolve => {
            let blob = new Blob([buffer], {type:"photo/png"})
            let reader = new FileReader()
            reader.onload = evt => {
                resolve(evt.target.result)
            }

            reader.readAsDataURL(blob)
        })
    }
}

let isMouseDown = false;
document.addEventListener('mousedown', () => {
    isMouseDown = true
});

document.addEventListener("mouseup", () => {
    isMouseDown = false
})
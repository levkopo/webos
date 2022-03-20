if(typeof require === "function") {
    let ngui = require("nw.gui")
    let nwin = ngui.Window.get()
    nwin.enterFullscreen();
}

let app = () => console.log("load error");
let cwd = "/"

const textDecoder = new TextDecoder()

createFile("/bin/sh", await (await fetch("packages/shell.js")).arrayBuffer())
createFile("/bin/cd", await (await fetch("packages/cd.js")).arrayBuffer())
createFile("/bin/ls", await (await fetch("packages/ls.js")).arrayBuffer())
createFile("/bin/touch", await (await fetch("packages/touch.js")).arrayBuffer())
createFile("/bin/cat", await (await fetch("packages/cat.js")).arrayBuffer())
createFile("/bin/rm", await (await fetch("packages/rm.js")).arrayBuffer())
createFile("/bin/write", await (await fetch("packages/write.js")).arrayBuffer())
createFile("/bin/js", await (await fetch("packages/js.js")).arrayBuffer())
createFile("/bin/echo", await (await fetch("packages/echo.js")).arrayBuffer())
createFile("/bin/wui", await (await fetch("packages/wui.js")).arrayBuffer())
createFile("/wallpaper.png", await (await fetch("wallpaper.png")).arrayBuffer())

setTimeout(async () => executeFile("/bin/sh"))

function createFile(path, content = new ArrayBuffer(0)) {
    localStorage.setItem(path, JSON.stringify({
        type: "file",
        content: new Uint8Array(content).map(it => it).toString()
    }))
}

function getFile(path) {
    const file = localStorage.getItem(path)
    if(file){
        const fileData = JSON.parse(file)
        if(fileData.type==="file")
            return textDecoder.decode(new Uint8Array(fileData.content.split(",")));
    }

    throw new Error("File "+path+" not exits")
}

function getFileContentArrayBuffer(path) {
    const file = localStorage.getItem(path)
    if(file){
        const fileData = JSON.parse(file)
        if(fileData.type==="file")
            return new Uint8Array(fileData.content.split(","));
    }

    throw new Error("File "+path+" not exits")
}

async function executeFile(path, args = "", print = console.log) {
    let println = (message = "") => print(message+"\n")

    eval(getFile(path))
    await app({
        print,
        println
    }, args)
}

function removeFile(path) {
    localStorage.removeItem(path)
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

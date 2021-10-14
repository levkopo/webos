app = async ({ println }, args) => {
    if(args.length!==0){
        if(args==="-v")
            println("WebUI version 1.0")

        return
    }

    println("WebUI starting..")

    const reader = new FileReader()
    const encoder = new TextEncoder()

    if(window.wui===true) {
        println("WebUI already started")
        return
    }

    Window(async view => {
        window.wui = true

        const windows = [];
        const windowCurrentListener = []

        let currentWindow = 0

        const waitActiveWindow = (windowId) => new Promise((resolve) => {
            if(currentWindow===windowId) resolve()
            else {
                const listenerId = windowCurrentListener.push(() => {
                    if(currentWindow===windowId) {
                        resolve()
                        delete windowCurrentListener[listenerId]
                    }
                })
            }
        })

        const redraw = async () => {
            view.setInfo({
                title: windows[currentWindow]?.info?.title||"WebOS"
            })

            const wallpaper = getFileContentArrayBuffer("/wallpaper.png")

            view.draw(`
                <div style="
                        position: relative;
                        width: 100%; 
                        height: 100%;
                        background: url('`+ await Base64.encodeArrayBuffer(wallpaper) +`') no-repeat center;
                        background-size: cover;
                        color: white">`
                +windows.map((it, id) => {
                    const width = it.info.fullscreen ? window.innerWidth: it.info.width
                    const height = it.info.fullscreen ? window.innerHeight: it.info.height
                    const x = it.info.fullscreen ? 0: it.info.x
                    const y = it.info.fullscreen ? 0: it.info.y

                    return `<div id="window-`+id+`" style="position: absolute;
                                                    background: black;
                                                    box-shadow: 2px 2px 6px #000000ad;
                                                    margin-top: `+y+`px;
                                                    margin-left: `+x+`px;
                                                    z-index: `+(currentWindow===id?100:0)+`"
                                                    class="unselectable">
                            <div style="position: relative;
                                        height: 2em;
                                        background: #202020;
                                        font-weight: bold;
                                        font-size: 1em;
                                        z-index: 10;
                                        display: flex;
                                        flex-direction: row"
                                        onclick="setCurrentWindow(`+id+`)">
                                 <div style="line-height: 2em;padding-left: 2em;">`
                                            + (it.info.title||"") + `</div>
                                 
                                 <div style="background: goldenrod; 
                                             height: 1em;
                                             width: 1em;
                                             margin: 0.5em 0.5em 0.5em auto;
                                             border-radius: 100vh;"
                                             onclick="fullscreenWindow(`+id+`);"></div>
                                 
                                 <div style="background: red; 
                                             height: 1em;
                                             width: 1em;
                                             margin: 0.5em 0.5em 0.5em 0.5em;
                                             border-radius: 100vh;"
                                             onclick="closeWindow(`+id+`);"></div>
                            </div>
                            
                            <div
                                id="window-content-`+id+`"
                                style="
                                    width: `+width+`px;
                                    height: `+height+`px;
                                    min-width: 200px;
                                    min-height: 200px;
                                    position: relative;
                                    overflow: auto;">` + (it.html||"") + `</div>
                            </div>
                            
                            <script>
                                
                            </script>`;
                })+
                `</div>`);
        }

        Window = (body) => {
            const windowId = windows.length
            currentWindow = windowId

            const thread = setTimeout(async () => {
                windows[windowId] = {
                    info: {
                        title: " ",
                        height: 200,
                        width: 400,
                        x: (windows[windowId-1]?.info?.x+20)||0,
                        y: (windows[windowId-1]?.info?.y+20)||0,
                        scrollX: 0,
                        scrollY: 0,
                        fullscreen: false
                    },
                    thread: thread,

                    html: ""
                }

                await redraw()
                await body({
                    setInfo: info => {
                        windows[windowId].info = { ...windows[windowId].info, ...info }
                        redraw()
                    },

                    draw: html => {
                        if(windows[windowId])
                        windows[windowId].html = html;
                        redraw()
                    },

                    nextChar: () => new Promise(resolve => {
                        waitActiveWindow(windowId).then(() => {
                            resolve(view.nextChar())
                        })
                    })
                })

                await redraw()
                delete windows[windowId]
                if(currentWindow===windowId) currentWindow = windowId-1
            })
        }

        setTimeout(async () => await executeFile("/bin/sh"))

        let isWindowMouseDown = false;
        let move = false;
        let offset = [0, 0]
        document.addEventListener('mousedown', (e) => {
            const dragWindow = windows[currentWindow]
            if(dragWindow!=null&&e.x>=dragWindow.info.x&&
                e.y>=dragWindow.info.y) {
                isWindowMouseDown = true

                move = e.x<dragWindow.info.x+dragWindow.info.width-10&&
                    e.y<dragWindow.info.y+dragWindow.info.height-10

                offset = [
                    dragWindow.info.x - e.x,
                    dragWindow.info.y - e.y,
                    dragWindow.info.width - e.x,
                    dragWindow.info.height - e.y,
                ]
            }
        });

        document.addEventListener("mouseup", () => {
            isWindowMouseDown = false
        })

        document.addEventListener('mousemove', (e) => {
            if(isWindowMouseDown) {
                const dragWindow = windows[currentWindow]
                if(dragWindow.info.fullscreen) return

                if(move) {
                    const dragWindowElement = document.getElementById("window-"+currentWindow)
                    const x = e.x + offset[0]
                    const y = e.y + offset[1]
                    if(x>0&&x+dragWindow.info.width<window.innerWidth) dragWindow.info.x = x
                    if(y>0&&y+dragWindow.info.height<window.innerHeight) dragWindow.info.y = y

                    dragWindowElement.style.marginLeft = dragWindow.info.x + "px"
                    dragWindowElement.style.marginTop = dragWindow.info.y + "px"
                }else{
                    const dragWindowElement = document.getElementById("window-content-"+currentWindow)
                    const width = e.x - dragWindow.info.x
                    const height = e.y - dragWindow.info.y

                    if(width>=200) dragWindow.info.width = width
                    if(height>=200) dragWindow.info.height = height

                    dragWindowElement.style.width = dragWindow.info.width + "px"
                    dragWindowElement.style.height = dragWindow.info.height + "px"
                }
            }
        });

        window.closeWindow = id => {
            clearTimeout(windows[id].thread)
            delete windows[id]
            redraw()
        }

        window.fullscreenWindow = id => {
            setCurrentWindow(id, true)
            windows[id].info.fullscreen = !windows[id].info.fullscreen

            redraw()
        }

        window.setCurrentWindow = (id, noDraw) => {
            currentWindow = id
            windowCurrentListener.forEach(it => it())

            window.addEventListener('overflow', e => {
                console.log(e)
            })

            if(!noDraw) redraw()
        }
    })
}
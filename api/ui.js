const mainWindowView = document.createElement("div");
mainWindowView.style.height = "100vh";
mainWindowView.style.width = "100vw";
mainWindowView.style.zIndex = "10";
document.body.append(mainWindowView)

let Window = (body) => {
    body({
        setInfo: (info) => {
            document.title = info.title
        },
        draw: (html) => {
            mainWindowView.innerHTML = html
        },

        nextChar: () => new Promise(resolve => {
            window.onkeydown = (key) => {
                resolve(key.key)
            }
        })
    })
}
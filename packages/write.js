const encoder = new TextEncoder()

app = (args) => {
    const parts = args.split(" ", 1)
    const path = new URL(parts.shift(), "file://"+cwd).toString()
        .substring("file://".length)

    //console.log(parts)
    createFile(path, encoder.encode(parts.join(" ")))
}
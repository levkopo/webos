app = (args) => {
    const path = new URL(args, "file://"+cwd).toString()
        .substring("file://".length)

    createFile(path, new ArrayBuffer(0))
}
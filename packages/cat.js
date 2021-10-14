app = ({ println }, args) => {
    const path = new URL(args, "file://"+cwd).toString()
        .substring("file://".length)

    println(getFile(path))
}
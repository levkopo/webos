app = ({ println }, args) => {
    const path = new URL(args, "file://"+cwd).toString()
        .substring("file://".length)

    for (const file in localStorage){
        if(file.startsWith(path)) removeFile(file)
    }
}
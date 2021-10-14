app = ({ println }, args) => {
    let path = new URL(args, "file://"+cwd).toString()
        .substring("file://".length)

    if(!path.endsWith("/")) path += "/";

    let files = []
    for (const file in localStorage){
        if(file.startsWith(path)){
            let fileName = file.substring(path.length)
            if(fileName.includes("/")){
                fileName = fileName.substring(0, fileName.indexOf("/")+1)
            }

            if(!files.includes(fileName)){
                files.push(fileName)
            }
        }
    }

    files.forEach(it => println(it))
}
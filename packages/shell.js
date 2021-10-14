app = async () => {
    Window(async (window) => {
        let output = ""
        let print = (message = "") => {
            output += message.replace("\n", "</br>")
            draw()
        }

        let println = (message = "") => {
            print(message+"</br>")
            draw()
        }

        const draw = (additional) => {
            window.draw("<div style='padding: 0.5em' class='selectable'>"+output+(additional||"")+"</div>")
        }

        window.setInfo({
            title: "WebOS Shell 1.0"
        })

        println("WebOS Shell 1.0")
        println()

        while (true) {
            print("$ ")

            let line = "";
            while (true) {
                const inputChar = await window.nextChar()
                if(inputChar==="Enter") break;
                if(inputChar==="Backspace"){
                    line = line.substring(0, line.length-1)
                }else if(inputChar.length===1) line += inputChar

                draw(escapeHTML(line))
            }

            println(escapeHTML(line))
            if(line.startsWith("exit")){
                println("Terminal is exit")
                break;
            }else if(line.startsWith("clear")){
                output = ""
            }else if(line.startsWith("title ")){
                window.setInfo({ title: line.substring("title ".length) })
            }else{
                if (line.length !== 0) {
                    const parts = line.trim().split(" ")
                    const program = parts.shift()
                    const args = parts.join(" ")

                    try {
                        await executeFile(cwd + program, args, print)
                    } catch (e) {
                        try {
                            await executeFile("/bin/" + program, args, print)
                        } catch (e) {
                            println(e.message)
                        }
                    }
                }
            }
        }
    })
}
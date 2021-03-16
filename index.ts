class CustomElement {

    public style : String 
    initStyle() {
        return {

        }
    }

    parseStyle() {
        const styleObj = this.initStyle()
        let styleStr = ``
        Object.keys(styleObj).forEach((styleKey) => {
            const styleValue = styleObj[styleKey]
            styleStr = `${styleStr}${styleKey}:${styleValue};`
        })
        this.style = styleStr
    }


    render() : String {
        this.parseStyle()
        return ""
    }
}

class Renderer {

    elements : Array<CustomElement> = []

    add(element : CustomElement) {
        this.elements.push(element)
        this.render()
    }

    render() {
        const htmlParts = this.elements.map((element : CustomElement) => element.render())
        console.log("HTML_PARTS", htmlParts)
        const htmlString = htmlParts.join("\n")
        document.body.innerHTML = htmlString
        console.log("HTML_STRING", htmlString) 
    }
}

const renderer : Renderer = new Renderer()

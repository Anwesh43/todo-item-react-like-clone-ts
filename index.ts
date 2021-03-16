class CustomElement {

    public style : string 

    children : Array<CustomElement> = []

    parent : Renderer | CustomElement

    mounted : boolean = false 

    initStyle() {
        return {

        }
    }

    add(child : CustomElement) {
        this.children.push(child)
        child.setParent(this)
        if (this.parent) {
            this.renderParent()
        }
        this.render()
    }

    setParent(parent : Renderer | CustomElement) {
        this.parent = parent
    }

    renderScript() {
        this.children.forEach((child) => {
            child.renderScript()
        })
    }

    parseStyle() {
        const styleObj = this.initStyle()
        let styleStr : string = ``
        Object.keys(styleObj).forEach((styleKey) => {
            const styleValue = styleObj[styleKey]
            styleStr = `${styleStr}${styleKey}:${styleValue};`
        })
        this.style = styleStr
    }

    mountElement() {
        this.children.forEach((child) => {
            if (child.children.length > 0 || child.shouldMount()) {
                child.mountElement()
            }
        })
        this.mounted = true;
        
    }

    shouldMount() : boolean {
        return !this.mounted
    }

    renderParent() {
        if (this.parent) {
            this.parent.renderParent()
        }
    }
    
    changeState() {
        //this.render()
        this.renderParent()
    }

    render() : string {
        this.parseStyle()
        return ""
    }
}

class TodoItem extends CustomElement {
    scale : number = 0
    constructor(private text : string) {
        super()
    }   

    mountElement() {
        super.mountElement()
        const interval = setInterval(() => {
            this.scale += 0.02
            if (this.scale >= 1) {
                this.scale = 1 
                clearInterval(interval)
            }
            this.changeState()
            //console.log("SCALE", this.scale)
        }, 10)
    }
    
    initStyle() {
       return {
           "width": `${100 * this.scale}%`,
           "height": "40px",
           "margin-top": "1%",
           "color": "white",
           "display": "flex",
           "justify-content": "center",
           "align-items": "center",
           "font-size": "15px",
           "background": "indigo"
       }
    }

    render() : string {
        super.render()
        return `<div style = "${this.style}">${this.text}</div>`
    }
}

class TodoItemContainer extends CustomElement {

    children : Array<CustomElement> = []

    initStyle() {
        return {
            "float": "top",
            "width": "100%",
        }
    }

    add(element : CustomElement) {
        this.children = [element, ...this.children]
        element.setParent(this.parent)
        this.renderParent()
    }

    renderChildren() : string {
        return this.children.map((child) => child.render()).join("\n")
    }

    render() : string {
        super.render()
        return `<div style = "${this.style}">
            ${this.renderChildren()}
        </div>`
    }
}

const todoItemContainer : TodoItemContainer = new TodoItemContainer()


class Renderer {

    elements : Array<CustomElement> = []
    mounted : boolean = false
    add(element : CustomElement) {
        this.elements.push(element)
        element.setParent(this)
        this.render()
    }

    renderParent() {
        this.render()
    }

    render() {
        const htmlParts = this.elements.map((element : CustomElement) => element.render())
        //console.log("HTML_PARTS", htmlParts)
        const htmlString = htmlParts.join("\n")
        document.body.innerHTML = htmlString
        this.elements.forEach((element) => {
            if (element.children.length > 0 || element.shouldMount()) {
                element.renderScript()
                element.mountElement()
            }
        })
        //console.log("HTML_STRING", htmlString) 
    }
}

const renderer : Renderer = new Renderer()



class InputBox extends CustomElement {

    value : string
    initStyle() {
        return {
            width: "50%"
        }
    }

    render() : string {
        super.render()
        return `<input id = "todoInput" type = "text" placeholder = "Enter an item" style = "${this.style}">`
    }
}

class ButtonElement extends CustomElement {

    initStyle() {
        return {
            width : "30%"
        }  
    }

    renderScript() {
        document.getElementById('btn1').onclick = () => {
            const todoInput : HTMLInputElement =  document.getElementById('todoInput') as HTMLInputElement
            const todoItem : TodoItem = new TodoItem(todoInput.value);
            todoItemContainer.add(todoItem);
            todoInput.value = ""
        }   
    }

    render() : string {
        super.render()
        //console.log("BTN_sTYLE", this.style)
        return `<button id = "btn1" style = "${this.style}">Add Todo</button>`
    }
}

class InputContainer extends CustomElement {

    initStyle() {
        return {
            width: "50%",
            display: "flex",
            "justify-content": "space-between"
        }
    }

    render() : string {
        super.render()
        return `<div style = "${this.style}">${this.children.map((element) => element.render()).join("\n")}</div>`
    }
}

const inputContainer = new InputContainer()
const buttonElement = new ButtonElement()
const inputBox : InputBox = new InputBox()
inputContainer.add(inputBox)
inputContainer.add(buttonElement)
renderer.add(inputContainer)
renderer.add(todoItemContainer)

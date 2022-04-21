const RENDER_TO_DOM = Symbol("render to dom")

export class Component {
    constructor() {
        this.props = Object.create(null);
        this.state = null;
        this.children = [];
    }

    setAttribute(name, value) {
        this.props[name] = value
    }

    appendChild(component) {
        this.children.push(component)
    }

    get vdom() {
        return this.render().vdom;
    }

    // get vchildren() {
    //     return this.children.map(child => child.vdom)
    // }

    //这个就是重新给document赋值的函数一直其对递归调用
    //this.render()函数调用重新生成document
    //自定义component有几层就会调用几层
    [RENDER_TO_DOM](range) {
        this._range = range
        this._vdom = this.vdom;//getter重新渲染
        this._vdom[RENDER_TO_DOM](range)
        // this.render()[RENDER_TO_DOM](range)
    }

    update() {
        let isSameNode = (oldNode, newNode) => {

            if (oldNode.type !== newNode.type)
                return false;
            for (let name in newNode.props) {
                if (newNode.props[name] !== oldNode.props[name]) {
                    return false
                }
            }
            if (Object.keys(oldNode.props).length > Object.keys(newNode.props).length)
                return false;

            if (newNode.type === "#text") {
                if (newNode.content !== oldNode.content)
                    return false
            }
            return true
        }


        let update = (oldNode, newNode) => {

            if (!isSameNode(oldNode, newNode)) {

                newNode[RENDER_TO_DOM](oldNode._range)
                return
            }
            newNode._range = oldNode._range;

            let newChildren = newNode.vchildren;
            let oldChildren = oldNode.vchildren;

            if (!newChildren || !newChildren.length) {
                return;
            }

            let tailRange = oldChildren[oldChildren.length - 1]._range;


            for (let i = 0; i < newChildren.length; i++) {
                let newChild = newChildren[i];
                let oldChild = oldChildren[i];
                if (i < oldChildren.length) {
                    update(oldChild, newChild)
                } else {
                    //TODO
                    let range = document.createRange();
                    range.setStart(tailRange.endContainer, tailRange.endOffset);
                    range.setEnd(tailRange.endContainer, tailRange.endOffset);
                    newChild[RENDER_TO_DOM](range);
                    tailRange = range;
                }
            }
        }
        let vdom = this.vdom
        update(this._vdom, vdom);
        this._vdom = vdom;
    }

    // rerender() {
    //     //将旧的range保存下来
    //     let oldRange = this._range;
    //     //新建一个range,在旧的rang之前暂时为null
    //     let range = document.createRange();
    //     range.setStart(oldRange.startContainer, this._range.startOffset)
    //     range.setEnd(oldRange.startContainer, this._range.startOffset)
    //
    //     //新rang有了更新的内容，旧rang变大了在前面包含了新rang！！！！！
    //     // Range.insertNode()在 Range 的起点处插入一个节点!!!!!!!
    //     this[RENDER_TO_DOM](range);
    //
    //     //将旧rang缩小到正确的旧内容范围（以前包含新旧内容）
    //     oldRange.setStart(range.endContainer, range.endOffset);
    //     // 将旧内容删除
    //     oldRange.deleteContents();
    //
    //
    //     //会有问题 应该用上面的方法,保证不丢数据
    //     // this._range.deleteContents();
    //     // this[RENDER_TO_DOM](this._range)
    // }


    setState(newState) {
        if (this.state === null || typeof this.state !== "object") {
            this.state = newState;
            this.update();
            // this.rerender();
            return
        }
        let merge = (oldState, newState) => {
            for (let p in newState) {
                if (oldState[p] === null || typeof oldState[p] !== "object") {
                    oldState[p] = newState[p]
                } else {
                    merge(oldState[p], newState[p])
                }
            }
        }
        merge(this.state, newState)

        // this.rerender();
        this.update();
    }

}

class ElementWrapper extends Component {
    constructor(type) {
        super(type);
        this.type = type
        // this.root = document.createElement(type)
    }

    // setAttribute(name, value) {
    //     //属性中事件和静态属性的 处理是不一样的
    //     if (name.match(/^on([\s\S]+)/)) {
    //         //以on开头的事件属性添加
    //         this.root.addEventListener(RegExp.$1.replace(/^[\s\S]/, c => c.toLowerCase()), value)
    //     } else {
    //         if (name === "className") {
    //             this.root.setAttribute("class", value)
    //         } else {
    //             this.root.setAttribute(name, value)
    //         }
    //     }
    //
    // }
    //
    //
    // appendChild(component) {
    //     let range = document.createRange()
    //     range.setStart(this.root, this.root.childNodes.length);
    //     range.setEnd(this.root, this.root.childNodes.length);
    //     component[RENDER_TO_DOM](range)
    //     // this.root.appendChild(component.root)
    // }

    get vdom() {
        this.vchildren = this.children.map(child => child.vdom)
        // this.vchildren = this.children
        return this
        // {
        //     type: this.type,
        //     props: this.props,
        //     children: this.children.map(child => child.vdom)
        // }
    }

    //这个就是重新给document赋值的函数
    [RENDER_TO_DOM](range) {
        //如果仅仅是为了第一次加载那么这里可以不用先删在插，这样做是为了在更新时起作用！！！！
        this._range = range

        let root = document.createElement(this.type)

        // setAttribute(name, value)
        for (let name in this.props) {
            let value = this.props[name]
            //属性中事件和静态属性的 处理是不一样的
            if (name.match(/^on([\s\S]+)/)) {
                //以on开头的事件属性添加
                root.addEventListener(RegExp.$1.replace(/^[\s\S]/, c => c.toLowerCase()), value)
            } else {
                if (name === "className") {
                    root.setAttribute("class", value)
                } else {
                    root.setAttribute(name, value)
                }
            }

        }
        // appendChild(component)
        if (!this.vchildren)
            this.vchildren = this.children.map(child => child.vdom)
        // if (!this.vchildren)
        //     this.vchildren = this.children
        for (let child of this.children) {
            let childRange = document.createRange()
            childRange.setStart(root, root.childNodes.length);
            childRange.setEnd(root, root.childNodes.length);
            child[RENDER_TO_DOM](childRange)
            // this.root.appendChild(component.root)
        }

        replaceContent(range, root);
        // range.deleteContents();
        // range.insertNode(root)
    }
}

class TextWrapper extends Component {
    constructor(content) {
        super(content);
        this.content = content;
        this.type = "#text";
    }

    get vdom() {
        return this
        // {
        //     type: "#text",
        //     content: this.content
        // }
    }

    //这个就是重新给document赋值的函数
    [RENDER_TO_DOM](range) {
        this._range = range
        let root = document.createTextNode(this.content);
        replaceContent(range,root)
        //
        // range.deleteContents();
        // range.insertNode(this.root);
    }
}

function replaceContent(range, node) {
    range.insertNode(node);
    range.setStartAfter(node);
    range.deleteContents();
    range.setStartBefore(node);
    range.setEndAfter(node)
}


//render() 优化了document.body.appendChild
//只在main函数调用render函数时运行一次！！！！
export function render(component, parentElement) {
    let range = document.createRange()
    range.setStart(parentElement, 0);
    range.setEnd(parentElement, parentElement.childNodes.length)

    //这里在第一次加载页面时调用，完成两件事1.将组件里的元素渲染到documnent中，2定义一个虚拟dom并填充数据
    component[RENDER_TO_DOM](range)
    // parentElement.appendChild(component.root)
}

export function createElement(type, attributes, ...children) {
    let e
    if (typeof type === "string") {
        e = new ElementWrapper(type);
        // e = document.createElement(type);
    } else {
        e = new type
    }

    for (let p in attributes) {
        e.setAttribute(p, attributes[p]);
    }

    let insertChildren = (children) => {
        for (let child of children) {
            if (typeof child === "string") {
                child = new TextWrapper(child);
                // i = document.createTextNode(i);
            }

            //没有这行的话<div></div>
            if (child === null) {
                continue
            }
            if (typeof child === "object" && child instanceof Array) {
                insertChildren(child)
            } else {
                e.appendChild(child)
            }

        }
    }

    insertChildren(children)

    return e
}
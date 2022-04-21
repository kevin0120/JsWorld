import {createElement, render, Component} from "./toy-react";

class Square extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: null,
        };
    }

    render() {
        return (
            <button
                className="square"
                onClick={() => this.setState({value: 'X'})}
            >
                {this.state.value}
            </button>
        );
    }
}

class Board extends Component {
    renderSquare(i) {
        return <Square/>;
    }

    render() {
        const status = 'Next player: X';

        return (
            <div>
                <div className="status">{status}</div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends Component {
    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board/>
                </div>
                <div className="game-info">
                    <div>{/* status */}</div>
                    <ol>{/* TODO */}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

render(
    <Game/>,
    document.getElementById('root')
);

// let game = <Game/>;
// console.log(game.vdom)
// import {createElement, render, Component} from "./toy-react";
//
//
// class MyComponent extends Component {
//     constructor() {
//         super();
//         this.state = {
//             a: 1,
//             b: 2
//         }
//     }
//
//     render() {
//         return <div>
//             <h1>my component</h1>
//             <button onClick={() => {
//                 this.setState({a: this.state.a + 1}
//                 )
//             }}>hello kevin
//             </button>
//             <span>{this.state.a.toString()}</span>
//             <span>{this.state.b.toString()}</span>
//             <h1>1234</h1>
//             {this.children}
//         </div>
//     }
// }
//
// render(<MyComponent id="a" class="c">
//         <div>hello</div>
//         <div>world</div>
//     </MyComponent>
//     , document.body);
// 给原生的对象加一个wrapper函数 使其能够appendchild一个自定义的对象


//render() 优化了document.body.appendChild()
// render(<div id="a" class="c">
//         <div>hello</div>
//         <div>world</div>
//         <div>!</div>
//         <h1>YJW</h1>
//     </div>
// ,document.body);

//上方代码等价于
// document.body.appendChild(createElement("div", {
//     id: "a",
//     "class": "c"
// }, createElement("div", null, "hello"), createElement("div", null, "world"),
// createElement("div", null, "!"), createElement("h1", null, "YJW")));

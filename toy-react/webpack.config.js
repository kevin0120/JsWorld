
module.exports=
    {entry: {
            main: './main.js'
        },
        module:{
            rules: [
                {
                    test:/\.js$/,
                    use:{
                        loader: 'babel-loader',
                        options: {
                            presets:['@babel/preset-env'],//将新版本的js for(let i of [1,2,3])翻译成旧版本的js 能够通用所有浏览器for (var _i = 0, _arr = [1, 2, 3]; _i < _arr.length; _i++)
                                //修改插件的pragma参数就可以将函数名改成任意值
                            plugins:[['@babel/plugin-transform-react-jsx',{pragma:"createElement"}]]//次插件的作用在打包时能够把<div>解析成React.createElement("div", null)
                        }
                    }
                }
            ]
        },
        // 开发模式以及minimize为false使生成的js可读性大大提高
        mode: "development",
        optimization: {
            minimize: false
        }
    }
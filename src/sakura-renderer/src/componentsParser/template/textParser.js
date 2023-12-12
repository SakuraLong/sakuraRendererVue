// 孙锦瑞
import Template from "./template";

class TextParser extends Template {
    constructor(option, content, rendererData) {
        super(option, content, rendererData);
        this.name = ["文本", "text"]; // 这个模板的名字
    }
    judge() {
        if (this.name.indexOf(this.dataList[0]) !== -1) {
            return true;
        } else {
            return false;
        }
    }
    analyseTemplate(content) {
        this.dataListInit(content); // 对dataList初始化，必须要写
        if (!this.judge()) return content; // 判断是不是这个模板

        let style = ""; // 用于存储生成的样式
        let text = ""; // 文本内容

        const switchKeyValue = (key, value) => {
            switch (key) {
                case "content":
                case "内容":
                    text = value;
                    break;
                case "color":
                case "颜色":
                    style += `color: ${value};`;
                    break;
                case "size":
                case "大小":
                    style += `font-size: ${value}px;`;
                    break;
                case "height":
                case "行高":
                    style += `line-height: ${value}px;`;
                    break;
                case "weight":
                case "粗细":
                    style += `font-weight: ${value};`;
                    break;
                case "bgcolor":
                case "背景色":
                    style += `background-color: ${value};`;
                    break;
                case "italic":
                case "斜体":
                    if (value === "true" || value === "false") {
                        style += `font-style: ${
                            value === "true" ? "italic" : "normal"
                        };`;
                    }
                    break;
                case "font":
                case "字体":
                    style += `font-family: ${value};`;
                    break;
            }
        };

        this.dataList.forEach((data, index) => {
            let key = data.split("=")[0];
            let value = data.split("=")[data.split("=").length - 1];
            switch (index) {
                case 1:
                    if (key === value) text = value;
                    else switchKeyValue(key, value);
                    break;
                default:
                    if (key === value) text = value;
                    else switchKeyValue(key, value);
                    break;
            }
        });

        let textItem = `<span style="${style}">${text}</span>`;

        return textItem;
    }
}

export default TextParser;
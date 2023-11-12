/*
段落解析器
李海林
*/

import ComponentsParser from "./componentParser"; // 组件解析器（各个具体组件解析器的父类）


class ParaParser extends ComponentsParser{
    constructor(component, option) {
        super(component, option);
        this.default = false; // 是否是组件模板（是否是{||}包裹）
        this.name = ["para", "段落"];
        this.template = {
            type: "sr-paragraph", // 组件名称
            data: {
                content: "", // 段落内容
                option: {
                    // 段落配置项
                    lineHeight: "DEFAULT", // 行高
                    type: "default", // 段落类型
                    bc:"DEFAULT", // 如果paraType是default，则是整个段落的边框色，如果paraType是custom，则是左边框色，其余的此值无效
                    bgc:"DEFAULT", // 如果paraType是default或者paraType是custom，则是整个段落的背景色，其余的此值无效
                    border:"-",
                    title:"DEFAULT",
                    model:true,
                },
            },
        }; // 标题段落配置
    }
    judge(){
        // console.log("组件内容：",this.component);
        // console.log(this.dataList);
        // 重写
        if (this.name.indexOf(this.dataList[0]) !== -1) {
            this.default = true;
            return true;
        } else if (this.component[0] !== "=" && (this.component[0] !== "{" && this.component[1] !== "|") ) {
            // console.log("组件内容：",this.component);
            this.template.model=false;
            return true;
        } else {
            return false;
        }
    }
    analyse(ignoreReplaceList = [], codeReplaceList = [], poemReplaceList = []) {
        this.template.data.option = Object.assign(this.template.data.option, this.baseOption); // 合并baseOption
        let styleList = [];
        console.log(this.component);
        if(this.template.model===false){
            // this.template.data.content += this.component+"<br>";
            this.template.data.content = this.component;
            this.template.data.content = this.replace(ignoreReplaceList, codeReplaceList, poemReplaceList, this.template.data.content);
            return {
                type: "success",
                msg: "",
                content: this.template,
            };
        }
        let divideIndex = this.dataList.indexOf("-");
        if(divideIndex === -1){
            // 格式错误
            return {
                type: "error",
                msg: "para格式错误",
                content: this.content,
            };
        }
        for(let i=0;i<divideIndex;i++){
            styleList.push(this.dataList[i]);
        }
        for(let i=divideIndex+1;i<this.dataList.length;i++){
            this.template.data.content += this.dataList[i]+"<br>";
        }

        // console.log("看这里",styleList);
        if (styleList.length!==0) {
            styleList.forEach((styleELe) => {
                let key = styleELe.split("=")[0];
                let value = styleELe.split("=")[styleELe.split("=").length - 1];
                switch(key){
                    case "BC":
                    case "borderColor":
                        this.template.data.option.bc = value;
                        break;
                    case "BGC":
                    case "backgroundColor":
                        this.template.data.option.bgc = value;
                        break;
                    case "border":
                        this.template.data.option.border = value;
                        break;
                    case "success":
                    case "warning":
                    case "tip":
                    case "info":
                        if(value===key){
                            if(["default", "success","warning","tip","info"].indexOf(value.toLowerCase()) !== -1){
                                console.log(["default", "success","warning","tip","info"].indexOf(value));
                                this.template.data.option.type = value;
                                this.template.data.option.title=this.template.data.option.type.toUpperCase();
                            }else if(key === value){
                                this.template.data.option.type = "default";
                            }
                        }
                        break;
                    case "type":
                        if(["default", "success","warning","tip","info"].indexOf(value.toLowerCase()) !== -1){
                            console.log(["default", "success","warning","tip","info"].indexOf(value));
                            this.template.data.option.type = value;
                            this.template.data.option.title=this.template.data.option.type.toUpperCase();
                        }else if(key === value){
                            this.template.data.option.type = "default";
                        }
                        break;
                    case "class":
                        this.template.data.option.classList = this.template.data.option.classList.concat(value.split(";"));
                        break;
                    case "style":
                        this.template.data.option.styleList = this.template.data.option.styleList.concat(value.split(";"));
                        break;
                    case "LH":
                    case "lineHeight":
                        this.template.data.option.lineHeight=value;
                        break;
                    case "title":
                        if(this.template.data.option.type!=="default"){
                            this.template.data.option.title=value;
                        }
                        else{
                            this.template.data.option.title=this.template.data.option.type.toUpperCase();
                        }
                        break;
                    default:
                        break;
                }
            });
        }
        this.template.data.content = this.replace(ignoreReplaceList, codeReplaceList, poemReplaceList, this.template.data.content);
        return {
            type: "success",
            msg: "",
            content: this.template,
        };
    }
}

export default ParaParser;
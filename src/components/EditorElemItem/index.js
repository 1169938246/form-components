import React from 'react';
import E from 'wangeditor';
import './index.less'

class EditorElem extends React.Component {

    constructor(props) {
        super(props);
        this.isChange = false;
        this.state = {
        }

    }
    componentDidMount() {
        const elemBody = this.refs.editorElemBody;
        this.editor = new E(elemBody)
        this.initEditor()
    }
    componentWillReceiveProps(nextProps) {

        if (nextProps.value != this.props.value) {
            if (!this.isChange) {
                this.editor.txt.html(nextProps.value)
            }
            this.isChange = false;
        }
    }

    initEditor() {
        // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
        this.editor.config.onchange = html => {
            this.isChange = true;
            // console.log(editor.txt.html())
            let editorContent = this.editor.txt.html();
            this.props.onChange(editorContent)
            // 不给延时，会导致详情调整过的内容修改后组件数据更新不了
            setTimeout(() => {
                this.isChange = false
            }, 50);
        }
        this.editor.config.menus = [
            'head', // 标题
            'bold', // 粗体
            'fontSize', // 字号
            'fontName', // 字体
            'italic', // 斜体
            'underline', // 下划线
            'strikeThrough', // 删除线
            'indent',
            'lineHeight',
            'foreColor', // 文字颜色
            'backColor', // 背景颜色
            'link', // 插入链接
            'list', // 列表
            'todo',
            'justify', // 对齐方式
            'quote', // 引用
            'emoticon', // 表情
            'image', // 插入图片
            'table', // 表格
            'video', // 插入视频
            'code', // 插入代码
            'splitLine',
            'undo', // 撤销
            'redo' // 重复
        ]
        this.editor.config.colors = ['#999', '#666', '#000000',
            '#eeece0',
            '#1c487f',
            '#4d80bf',
            '#c24f4a',
            '#8baa4a',
            '#7b5ba1',
            '#46acc8',
            '#f9963b',
            '#ffffff'];
        // editor.config.uploadImgShowBase64 = true;
        this.editor.config.pasteIgnoreImg = true;
        this.editor.config.uploadImgServer = `${configs.host.test}/api/FileUpload/Upload`;  // 上传图片到服务器 
        this.editor.config.uploadFileName = 'fileName'
        this.editor.config.uploadImgParams = {
            merchantId: localStorage.getItem('MerchantId'),
            Directory: 'Image'
        }
        // 限制一次最多上传 1 张图片
        this.editor.config.uploadImgMaxLength = 1;
        // 将 timeout 时间改为 3s
        // this.editor.config.uploadImgTimeout = 3000;
        this.props.zIndex && (this.editor.config.zIndex = this.props.zIndex);
        this.editor.config.uploadImgHeaders = {
            Accept: 'multipart/form-data',
            // Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            // MerchantId: localStorage.getItem('MerchantId')
        }
        this.editor.config.uploadImgHooks = {
            before: function (xhr, editor, files) {
                // 图片上传之前触发
            },
            success: function (xhr, editor, result) {
                // 图片上传并返回结果，图片插入成功之后触发
            },
            fail: function (xhr, editor, result) {
                // 图片上传并返回结果，但图片插入错误时触发
            },
            error: function (xhr, editor) {
                // 图片上传出错时触发
            },
            // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
            // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
            customInsert: function (insertImg, result, editor) {
                // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
                // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果
                // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
                var url = result.data;
                insertImg(url);
                // result 必须是一个 JSON 格式字符串！！！否则报错
            }
        }
        this.editor.create()
        this.props.value && this.editor.txt.html(this.props.value);
        // 开启编辑功能
        if (this.props.disabled) {
            this.editor.disable()
        }
        // this.editor.$textElem.attr('contenteditable', this.props.disabled ? false : true)
    }
    render() {
        return (
            <div className="text-area" >
                <div
                    style={{
                        // height: 335,
                    }}
                    ref="editorElemBody" className="editorElem-body">

                </div>
            </div>
        )
    }
}

export default EditorElem;

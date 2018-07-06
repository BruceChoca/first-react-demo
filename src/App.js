/* eslint import/no-webpack-loader-syntax: off */
import React, { Component } from 'react';
import './App.css';
import showdown from 'showdown'; // 页面内容转换
import prism from 'prismjs';

const style1 = require('!raw-loader!./text/style1.css');
const style2 = require('!raw-loader!./text/style2.css');
const content = require('!raw-loader!./text/content.txt');

let interval;

let writeChar = async (that, nodeName, char) => new Promise((resolve) => {
  setTimeout(() => {
    if(nodeName === 'styleArea') {
      let style = that.state.domStyle + char;
      let html = prism.highlight(style, prism.languages.css);
      that.setState({
        styleTxt: html,
        domStyle: style
      });

      that.styleNode.scrollTop = that.styleNode.scrollHeight;
    } else if(nodeName === 'contentArea') {
      let content = that.state.contentTxt + char;
      let converter = new showdown.Converter();
      let html = converter.makeHtml(content);
      that.setState({
        contentTxt: content,
        domContent: html
      });

      that.contentNode.scrollTop = that.contentNode.scrollHeight;
    }

    if (char === "？" || char === "，" || char === '！') {
        interval = 800
    } else {
        interval = 22
    }

    resolve();
  }, interval)
});

/**
 * 填充文字
 * that 作用域  nodeName 填充节点名称 index 内容索引 text 填充内容
 */
let write = async (that, nodeName, index, text) => {
  let speed = 1;
  let char = text.slice(index, index + speed);
  index += speed;

  if(index > text.length) return;
  await writeChar(that, nodeName, char);
  await write(that, nodeName, index, text);
}

class App extends Component {
  constructor(prop) {
    super(prop);
    this.state = {
      styleTxt: '',  // 样式描述内容，显示
      domStyle: '',  // 具体样式
      contentTxt: '', // 内容
      domContent: '' // 内容样式
    }
  }

  componentDidMount() {
    // 初始化参数开始执行
    (async (_this) => {
      // 填充文字
      await write(this, 'styleArea', 0, style1);
      await write(this, 'contentArea', 0, content);
      await write(this, 'styleArea', 0, style2);
    })(this);
  }

  render() {
    return (
      <div>
        <div className='styleArea' ref={(node) => { this.styleNode = node; }}>
          <div dangerouslySetInnerHTML={{ __html: this.state.styleTxt }}></div>
          <style dangerouslySetInnerHTML={{ __html: this.state.domStyle }}></style>
        </div>
        <div className='contentArea' ref={(node) => { this.contentNode = node; }} 
          dangerouslySetInnerHTML={{ __html: this.state.domContent }}>
        </div>
      </div>
    );
  }
}

export default App;

import React from 'react';
import { message, Select } from 'antd';
const Option = Select.Option;

function cutWord(len, text, record, index) {
  text = text || '';
  return <span title={text}>
    {text.length > len ? text.slice(0, len) + '...' : text}
  </span>
}

function cutWordByWidth(width, text, record, index) {
  width -= 17;
  width = width < 20 ? 20 : width;

  text = text || '';
  return <div className='ellipsis' title={text} style={{ width }}>
    {text}
  </div>
}

function convertEnum(enumObj, text, record, index) {
  text = text;
  if (enumObj && enumObj[text + '']) {
    text = enumObj[text + '']
  }

  return <span title={text}>
    {text}
  </span>
}

//zhouwen
function convertEnum1(text, obj) {
  return <span title={text}>
    {obj[text + ''] || '--'}
  </span>
}

function convertImg(text, record, index) {
  return <img src={text} />
}

function timeshow(text, record, index) {
  if (text === '0001-01-01 00:00:00') {
    return <span></span>
  } else {
    return <span>{text}</span>
  }
}

function enumRenderWithSelect(enumObj) {
  var xopts = [];

  if (!enumObj) return;

  for (var key in enumObj) {
    xopts.push(
      <Option key={key} title={enumObj[key]} value={key}>{enumObj[key]}</Option>
    )
  }

  return xopts;
}

function getScrollHeight() {
  var h = document.body.clientHeight - 220;

  return h < 100 ? 100 : h;
}

function getScrollY() {
  const contentHeight = document.getElementsByClassName("ant-layout-content")[0].clientHeight;
  const tableHeight = contentHeight - 370;
  return tableHeight;
}

function getScrollWidth(columns, defaultWidth) {
  // 设置自适应宽度列的宽度（通常为最后一列）
  defaultWidth = defaultWidth || 150;
  if (defaultWidth < 150) {
    defaultWidth = 150;
  }
  const wArr = columns.map(each => parseInt(each.width)); //eslint-disable-line
  let scrollWidth = 0;
  wArr.forEach(each => {
    scrollWidth += each || defaultWidth;
  });

  return scrollWidth;
}

function getScrollWidthx(columns) {
  var wArr = columns.map(each => parseInt(each.width));
  var scrollWidth = 0;
  wArr.forEach(each => {
    scrollWidth += each || 150;
  })

  return scrollWidth;
}

function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var reg_rewrite = new RegExp("(^|/)" + name + "/([^/]*)(/|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  var q = window.location.pathname.substr(1).match(reg_rewrite);
  if (r != null) {
    return unescape(r[2]);
  } else if (q != null) {
    return unescape(q[2]);
  } else {
    return null;
  }
}
function secondToDate(second_time) {
  var time = parseInt(second_time) > 9 ? parseInt(second_time) + "秒" : '0' + parseInt(second_time) + "秒";
  if (parseInt(second_time) > 60) {
    var second = parseInt(second_time) % 60;
    var min = parseInt(second_time / 60);
    time = '00:' + (min > 9 ? min : '0' + min) + ":" + (second > 9 ? second : '0' + second) + "";

    if (min > 60) {
      min = parseInt(second_time / 60) % 60;
      var hour = parseInt(parseInt(second_time / 60) / 60);
      time = (hour > 9 ? hour : '0' + hour) + ":" + (min > 9 ? min : '0' + min) + ":" + (second > 9 ? second : '0' + second) + "";
      if (hour > 24) {
        hour = parseInt(parseInt(second_time / 60) / 60) % 24;
        var day = parseInt(parseInt(parseInt(second_time / 60) / 60) / 24);
        time = day + "天 " + (hour > 9 ? hour : '0' + hour) + ":" + (min > 9 ? min : '0' + min) + ":" + (second > 9 ? second : '0' + second) + "";
      }
    }
  }
  return time;
}
function toParams(obj) {
  if (typeof obj == 'string') {
    // 如果传入的 obj 是一个字符串（经过 JSON.stringify() 处理）：'{ "key": "value", "key1": "value1"}'
    obj = JSON.parse(obj);
  }

  // 如果传入的 obj 是一个对象：{key: "value", key1: "value1"}
  var key, value, _str, str, strResult;

  for (key in obj) {
    value = obj[key];

    // 拼接一个单元
    _str = '&' + key + '=' + value;

    // 拼接所有
    str += _str;

    // 返回一个去掉 "undefined&" 的子字符串
    strResult = str.substring(10)
  }

  return strResult;
}

import { Modal } from 'antd';
const confirm = Modal.confirm;


function toReturnIntegral(that, id, opType) {
  confirm({
    title: '温馨提示',
    content: '是否确认对订单进行退积分操作',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      toReturnIntegralFn(that, id, opType)
    },
    onCancel() {
    },
  })

}

function toReturnIntegralFn(that, id, opType) {
  that.props.dispatch({
    type: 'chinaUnicomIntegral/updateIntegralOrderStatus', payload: {
      id,
      opType,  // 1联通 2移动中行老项目 3新系统
    }
  }).then(res => {
    const { data, code } = res
    if (code === '0') {
      that.getData()
    } else {
      message.info(res.message)
    }
  });
}
export {
  cutWord,
  cutWordByWidth,
  convertEnum,
  enumRenderWithSelect,
  getScrollHeight,
  getScrollWidth,
  timeshow,
  convertImg,
  convertEnum1,
  getQueryString,
  secondToDate,
  getScrollY,
  toParams,
  toReturnIntegral
};

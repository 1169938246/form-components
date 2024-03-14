import React, { useState, useEffect } from 'react';
import { message, Upload, Icon } from 'antd';

function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = !0,
      o = !1;
    try {
      if (i = (t = t.call(r)).next, 0 === l) {
        if (Object(t) !== t) return;
        f = !1;
      } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
    } catch (r) {
      o = !0, n = r;
    } finally {
      try {
        if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function (r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), !0).forEach(function (r) {
      _defineProperty(e, r, t[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
    });
  }
  return e;
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : String(i);
}
function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var UploadImage = function UploadImage(_ref) {
  var _ref$imgSize = _ref.imgSize,
    imgSize = _ref$imgSize === void 0 ? 50 : _ref$imgSize,
    _ref$data = _ref.data,
    data = _ref$data === void 0 ? {
      Directory: 'Image'
    } : _ref$data,
    _ref$disabled = _ref.disabled,
    disabled = _ref$disabled === void 0 ? false : _ref$disabled,
    _onChange = _ref.onChange,
    value = _ref.value;
  var _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    loading = _useState2[0],
    setLoading = _useState2[1];
  var _useState3 = useState([]),
    _useState4 = _slicedToArray(_useState3, 2),
    fileList = _useState4[0],
    setFileList = _useState4[1];
  useEffect(function () {
    setImg();
  }, [value]);
  var beforeUpload = function beforeUpload(file) {
    var isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('只能上传图片文件!');
      return false;
    }
    var isLt4M = file.size / 1024 < imgSize;
    if (!isLt4M) {
      message.error("\u56FE\u7247\u5927\u5C0F\u4E0D\u80FD\u8D85\u8FC7".concat(imgSize, "KB!"));
      _onChange('');
    }
    return isLt4M;
  };
  var uploadConfig = {
    action: "".concat(configs.host.test, "/api/FileUpload/Upload"),
    listType: 'picture-card',
    onChange: function onChange(info) {
      setFileList(info.fileList);
      if (info.file.status === 'uploading') {
        setLoading(true);
        return;
      }
      if (info.file.status === 'done') {
        if (info.file.response.code === '0') {
          message.success("".concat(info.file.name, " \u4E0A\u4F20\u5B8C\u6210"));
          _onChange(info.file.response.data);
        } else {
          _onChange('');
          message.error("".concat(info.file.name, " \u4E0A\u4F20\u5931\u8D25"));
        }
      }
    },
    onRemove: function onRemove() {
      setLoading(false);
      _onChange('');
    }
  };
  var setImg = function setImg() {
    if (value) {
      setFileList([{
        uid: 1,
        name: 'xxx.jpg',
        status: 'done',
        url: value
      }]);
    } else {
      setFileList([]);
    }
  };
  return /*#__PURE__*/React.createElement(Upload, _extends({}, uploadConfig, {
    name: "filename",
    data: _objectSpread2(_objectSpread2({}, data), {}, {
      merchantId: localStorage.getItem('MerchantId')
    }),
    defaultFileList: fileList,
    fileList: fileList,
    beforeUpload: beforeUpload,
    disabled: disabled
  }), fileList.length > 0 ? null : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Icon, {
    type: loading ? 'loading' : 'plus'
  }), /*#__PURE__*/React.createElement("div", {
    className: "ant-upload-text"
  }, "\u4E0A\u4F20")));
};

export { UploadImage };

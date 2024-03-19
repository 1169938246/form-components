export default {
  formatZero(num, len) {
    if (String(num).length > len) return num;
    return (Array(len).join(0) + num).slice(-len);
  },
  getParam: function (paramName) {
    // 获取参数
    var url = window.location.search;
    // 正则筛选地址栏
    var reg = new RegExp("(^|&)" + paramName + "=([^&]*)(&|$)");
    // 匹配目标参数
    var result = url.substr(1).match(reg);
    //返回参数值
    return result ? decodeURIComponent(result[2]) : null;

  },
  clearNoNum: function (obj) {
    obj.value = obj.value.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符
    obj.value = obj.value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
    obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//只能输入两个小数
    if (obj.value.indexOf(".") < 0 && obj.value != "") {//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
      obj.value = parseFloat(obj.value);
    }
  },
  // 加
  accAdd: function (arg1, arg2) {
    var r1, r2, m;
    try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
    try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
    m = Math.pow(10, Math.max(r1, r2))
    return (Math.round(arg1 * m) + Math.round(arg2 * m)) / m
  }
  ,
  // 除
  accDiv: function (arg1, arg2) {
    var t1 = 0, t2 = 0, r1, r2;
    var t1 = 0, t2 = 0, r1, r2;
    try {
      t1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
    }
    try {
      t2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
    }
    try {
      r1 = Number(arg1.toString().replace(".", ""));
      r2 = Number(arg2.toString().replace(".", ""));
    }
    catch (e) {
    }
    return (r1 / r2) * Math.pow(10, t2 - t1);
  }
  ,
  // 减
  Subtr: function (arg1, arg2) {
    var r1, r2, m, n;
    try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
    try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
    m = Math.pow(10, Math.max(r1, r2));
    n = (r1 >= r2) ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(n);
  }
  ,
  // 乘
  accMul: function (arg1, arg2) {
    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();

    try { m += s1.split(".")[1].length } catch (e) { }

    try { m += s2.split(".")[1].length } catch (e) { }

    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
  },
  // 数组移动
  swapItems: function (arr, index1, index2) {
    arr[index1] = arr.splice(index2, 1, arr[index1])[0];
    return arr;
  },
  stringCutOut(str, num) {
    if (str.length > num) return str.substring(0, num) + '...';
    return str;
  },
  getIntervalHour(s1, s2) {
    s1 = new Date(s1.replace(/-/g, '/'));
    s2 = new Date(s2.replace(/-/g, '/'));
    var ms = Math.abs(s1.getTime() - s2.getTime());
    return parseInt(ms / 1000 / 60 / 60);
  },
  toThousands(num) {
    num = num.toString().replace(/$|\,/g, '');
    if (isNaN(num))
      num = "0";
    let sign = (num == (num = Math.abs(num)));
    num = Math.floor(num * 100 + 0.50000000001);
    let cents = num % 100;
    num = Math.floor(num / 100).toString();
    if (cents < 10)
      cents = "0" + cents;
    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
      num = num.substring(0, num.length - (4 * i + 3)) + ',' +
        num.substring(num.length - (4 * i + 3));
    return (((sign) ? '' : '-') + num + '.' + cents);
  },
  urlParse(query) {
    let obj = {};
    const reg = /[?&][^?&]+=[^?&]+/g;
    const arr = query.match(reg);
    if (arr) {
      arr.forEach((item) => {
        let tempArr = item.substring(1).split('=');
        let key = decodeURIComponent(tempArr[0]);
        let val = decodeURIComponent(tempArr[1]);
        obj[key] = val;
      });
    }
    return obj;
  },
  secondToDate(second_time) {
    var time =
      parseInt(second_time) > 9
        ? "00:00:" + parseInt(second_time)
        : "00:00:0" + parseInt(second_time);
    if (parseInt(second_time) > 60) {
      var second = parseInt(second_time) % 60;
      var min = parseInt(second_time / 60);
      time =
        "00:" +
        (min > 9 ? min : "0" + min) +
        ":" +
        (second > 9 ? second : "0" + second) +
        "";

      if (min > 60) {
        min = parseInt(second_time / 60) % 60;
        var hour = parseInt(parseInt(second_time / 60) / 60);
        time =
          (hour > 9 ? hour : "0" + hour) +
          ":" +
          (min > 9 ? min : "0" + min) +
          ":" +
          (second > 9 ? second : "0" + second) +
          "";
        if (hour > 24) {
          hour = parseInt(parseInt(second_time / 60) / 60) % 24;
          var day = parseInt(parseInt(parseInt(second_time / 60) / 60) / 24);
          time =
            day +
            "天 " +
            (hour > 9 ? hour : "0" + hour) +
            ":" +
            (min > 9 ? min : "0" + min) +
            ":" +
            (second > 9 ? second : "0" + second) +
            "";
        }
      }
    }
    return time;
  },
  keepTwoDecimalFull(num) {
    var result = parseFloat(num);
    result = Math.round(num * 100) / 100;
    var s_x = result.toString(); //将数字转换为字符串
    var pos_decimal = s_x.indexOf('.'); //小数点的索引值
    // 当整数时，pos_decimal=-1 自动补0  
    if (pos_decimal < 0) {
       pos_decimal = s_x.length;
       s_x += '.';
    }
    // 当数字的长度< 小数点索引+2时，补0  
    while (s_x.length <= pos_decimal + 2) {
       s_x += '0';
    }
    return s_x;
 }
}


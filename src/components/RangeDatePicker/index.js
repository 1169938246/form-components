 {/*
 disabledAfter 日期限制 例如传入5 则只能选择今天日期+5天内的时间
*/}
import React from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';

const { RangePicker } = DatePicker;

const CustomRangePicker = ({ value, onChange, disabledAfter, ...restProps }) => {
  // 处理日期格式转换
  const handleChange = (dates) => {
    if (onChange) {
      // 将 moment 对象转换为字符串
      const formattedDates = dates.map(date => date.format('YYYY-MM-DD HH:mm:ss'));
      onChange(formattedDates);
    }
  }

  // 判断是否在 disabledAfter 时间之后
  const disabledDate = (current) => {
    return current && current < moment().subtract(1, 'days').endOf('day') || current && current > moment(new Date()).add(disabledAfter, 'days'); 
  }

  const ranges = {
    '今天': [moment().startOf('day'), moment().endOf('day')],
    '昨天': [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],
    '上周': [moment().subtract(1, 'weeks').startOf('week'), moment().subtract(1, 'weeks').endOf('week')],
    '本周': [moment().startOf('week'), moment().endOf('week')],
    '上月': [moment().subtract(1, 'months').startOf('month'), moment().subtract(1, 'months').endOf('month')],
    '本月': [moment().startOf('month'), moment().endOf('month')],
  };

  return (
    <RangePicker
      showTime={{ format: 'HH:mm:ss' }}
      format="YYYY-MM-DD HH:mm:ss"
      ranges={ranges}
      value={value ? [moment(value[0]), moment(value[1])] : undefined}
      onChange={handleChange}
      disabledDate={disabledAfter ? disabledDate : undefined}
      {...restProps}
    />
  );
}

export default CustomRangePicker;

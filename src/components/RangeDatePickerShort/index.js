{/*
startFieldName 开始时间标识
endFieldName 结束时间标识
rules 是否开启规则校验 默认开启
detailData 详情数据，用于编辑回显
dateRange 限制结束时间的范围 例如：开始时间选择了 2024-02-05 ，加上 dateRange=3 后 只能选择 2024-02-05到 2024-02-08内的日期
*/}
import React, { Fragment } from 'react';
import { Form, DatePicker, Input } from 'antd';
import moment from 'moment';

const { Item } = Form;

const RangeDatePickerShort = ({ form, startFieldName, endFieldName, rules = true, detailData={},dateRange}) => {
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  const handleDateChange = (fieldName, val) => {
    form.setFieldsValue({
      [fieldName]: val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : null,
    });
  };

  return (
   <Fragment>
      <Item
        style={{
          display: 'inline-block',
        }}
      >
        {form.getFieldDecorator("startDatePickerFieldName", {
          rules: [{ required: rules, message: '请选择开始时间' }],
          initialValue: detailData && detailData[startFieldName] ? moment(detailData[startFieldName]) : null
        })(
          <DatePicker
            disabledDate={(val) => {
              let endVal = form.getFieldValue("endDatePickerFieldName");
              if (!val || !endVal) {
                return false;
              }
              return val.valueOf() > endVal.valueOf();
            }}
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            onChange={(val) => handleDateChange(startFieldName, val)}
          />
        )}
      </Item>
      <span
        style={{
          display: 'inline-block',
          width: '24px',
          textAlign: 'center',
        }}
      >
        -
      </span>
      <Item
        style={{
          display: 'inline-block',
        }}
      >
        {form.getFieldDecorator("endDatePickerFieldName", {
          rules: [{ required: rules, message: '请选择结束时间' }],
          initialValue: detailData && detailData[endFieldName] ? moment(detailData[endFieldName]) : null
        })(
          <DatePicker
            disabledDate={(val) => {
              let startVal = form.getFieldValue("startDatePickerFieldName");
              if (!val || !startVal) {
                return false;
              }
              if(dateRange){
                const minDate = moment(startVal).add(dateRange, 'days'); // 加上指定的天数范围
                return val.valueOf() <= startVal.valueOf() || val.valueOf() > minDate.valueOf();
              }else{
                return val.valueOf() <= startVal.valueOf() 
              }
            }}
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            onChange={(val) => handleDateChange(endFieldName, val)}
          />
        )}
      </Item>
      <Item {...formItemLayout} style={{ display: "none" }}>
        {form.getFieldDecorator(startFieldName, {
        })(
          <Input />
        )}
      </Item>
      <Item {...formItemLayout} style={{ display: "none" }}>
        {form.getFieldDecorator(endFieldName, {
        })(
          <Input />
        )}
      </Item>
      </Fragment>
  );
};

export default RangeDatePickerShort;

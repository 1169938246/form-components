import React from "react";
import { Select } from "antd";
const SelectDate = ({ value, onChange, type = "week" }) => {
  const handleChange = (value) => {
    onChange(value);
  };

  const days = [
    { key: "周一", value: 1 },
    { key: "周二", value: 2 },
    { key: "周三", value: 3 },
    { key: "周四", value: 4 },
    { key: "周五", value: 5 },
    { key: "周六", value: 6 },
    { key: "周日", value: 7 },
  ];
  const daysList = Array.from({ length: 31 }, (_, i) => (i + 1).toString());

  return (
    <Select
      className="coupons-selectWidth"
      style={{ width: "150px", margin: "0 10px" }}
      onChange={handleChange}
      value={value && value.toString()}
      allowClear
    >
      {type === "week" &&
        days.map((day) => (
          <Select.Option key={day.value}>{day.key}</Select.Option>
        ))}
      {type === "day" &&
        daysList.map((day) => (
          <Select.Option key={day} value={day}>
            {day + "号"}
          </Select.Option>
        ))}
    </Select>
  );
};

export default SelectDate;

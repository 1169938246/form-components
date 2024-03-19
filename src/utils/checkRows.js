import {findIndex,remove} from  "lodash"

export default (value, selectedRowKeys, selectedRows, param, type,getCheckboxProps) => {
  return {
    type: type || 'checkbox',
    selectedRowKeys,
    onChange(selectedRowKeys) {
      value.setState({ selectedRowKeys });
    },
    getCheckboxProps,
    onSelect: (record, selected) => {
      if (selected) {
        // 如果数组里面不存在则做添加
        if (type) {
          selectedRows[0] = record;
        } else {
          if (findIndex(selectedRows, record[param]) < 0) {
            selectedRows.push(record);
          }
        }
      } else {
        remove(selectedRows, (n) => {
          return n[param] === record[param];
        });
      }
      value.setState({
        selectedRows
      }, () => {
        console.log(value.state, "8899");
      });
    },
    onSelectAll: (selected, selectedRow, changeRows) => {
      if (selected) {
        for (let index = 0; index < changeRows.length; index += 1) {
          if (findIndex(selectedRows, changeRows[index][param]) < 0) {
            selectedRows.push(changeRows[index]);
          }
        }
      } else {
        for (let index = 0; index < changeRows.length; index += 1) {
          remove(selectedRows, (n) => (
            n[param] === changeRows[index][param]
          ));
        }
      }
      value.setState({
        selectedRows
      });
    }
  };
};

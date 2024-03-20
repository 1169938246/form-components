import React, { Component, Fragment } from "react";
import {
  Form,
  Spin,
  Table,
  Modal,
  Row,
  Col,
  Input,
  message,
  Button,
  Select,
} from "antd";
import { connect } from "dva";
const FormItem = Form.Item;
const Option = Select.Option;
class PickProductModalWap extends Component {
  constructor(props) {
    super(props);
    const {value} = props;
    (this.state = {
      ProClassListdata: [],
      ProClassTwoListdata: [],
      postData: {
        PageIndex: 1,
        PageSize: 10,
        MerInfoId: localStorage.getItem("MerchantId"),
      },
      selectedRowKeys: [],
      selectedRows: [],
      currentData: {
        ProOneClassId: "",
        ProClassId: "",
        ProductName: "",
        ProductCode: "",
      },
      tableData: [],
      storageSelectedRows: [],
      storageSelectedRowKeys: [],
      productCheckList: props.productCheckList,
      showModal: false,
      value: value
    }),
      (this.columns = [
        {
          key: "proInfoId",
          title: "自营商品编码",
          dataIndex: "proInfoId",
        },
        {
          key: "platformProductId",
          title: "平台商品编码",
          dataIndex: "platformProductId",
        },
        {
          key: "productName",
          title: "平台商品名称",
          dataIndex: "productName",
        },
        {
          key: "proTitle",
          title: "自营商品名称",
          dataIndex: "proTitle",
        },
        {
          key: "proOneClassName",
          title: "所属一级分类",
          dataIndex: "proOneClassName",
        },
        {
          key: "proTwoClassName",
          title: "所属二级分类",
          dataIndex: "proTwoClassName",
        },
        {
          key: "productType",
          title: "商品属性",
          dataIndex: "productType",
          render(text) {
            const arr = ["", "话费", "流量", "卡密", "直充"];
            return arr[text];
          },
        },
      ]);
  }
  componentDidMount() {
    //请求一级商品分类
    this.props.dispatch({
      type: "productlist/getProClasslist",
      params: { merInfoId: localStorage.getItem("MerchantId") },
      callback: ({ code, data, message: info }) => {
        if (code === "0") {
          this.setState({
            ProClassListdata: data.list,
          });
        } else {
          message.error(info);
        }
      },
    });
    this.init();
  }

  init = () => {
    const { productCheckList } = this.state
    let produceListIds = []
    if (productCheckList) {
      productCheckList.forEach(element => {
        produceListIds.push(element.proInfoId);
      });
    }
    
    //请求商品列表
    this.props.dispatch({
      type: "productlist/getprodctList",
      params: {
        ...this.state.postData,
        ...this.state.currentData,
        proStatus: 2,
        ids: produceListIds.join(",")
      },
      callback: ({ code, data, message: info }) => {
        if (code === "0") {
          data.list.list.map((item) => {
            item.categoryName = item.proTwoClassName;
            item.categoryId = item.flashSaleProClassList[0]
              ? item.flashSaleProClassList[0].twoClassId
              : "";
            item.costPrice = item.price; // 成本价
            item.productId = item.proInfoId;
            item.parentCategoryName = item.proOneClassName;
            if (this.props.value === item.proInfoId) {
              this.setState({
                selectedRowKeys: [item.proInfoId],
                selectedRows: [item]
              })
            }
          });
          this.setState({
            total: data.list.total,
            tableData: data.list.list,
          });
        } else {
          message.error(info);
        }
      },
    });
  };
  handleClose = () => {
    this.setState({
      showModal: false,
      postData: {
        PageIndex: 1,
        PageSize: 10,
        MerInfoId: localStorage.getItem("MerchantId"),
      },
      currentData: {
        ProOneClassId: "",
        ProClassId: "",
        ProductName: "",
        ProductCode: "",
      },
    })

  };
  handelOk = () => {
    const { selectedRowKeys, selectedRows } = this.state;
    const {handleSelectedRowsChange,onChange} = this.props;
    if (selectedRows.length) {
      this.handleClose();
      onChange(selectedRowKeys)
      handleSelectedRowsChange && handleSelectedRowsChange(selectedRows) //对外暴露出一个 selectedRows
    } else {
      message.error('请选择商品');
    }
  };
  ProclassChange = (val) => {
    if (val) {
      //请求二级商品分类
      this.props.dispatch({
        type: "productlist/getProClassTwoList",
        params: { proClassId: val },
        callback: ({ code, data, message: info }) => {
          if (code === "0") {
            if (!data.list) {
              this.props.form.setFieldsValue({
                ProClassId: "",
              });
            }
            this.setState({
              ProClassTwoListdata: data.list,
            });
          } else {
            message.error(info);
          }
        },
      });
    } else {
      // 置空二级分类
      this.setState({
        ProClassTwoListdata: [],
      });
    }
    this.setState({
      currentData: {
        ...this.state.currentData,
        ProOneClassId: val,
      },
    });
  };
  ProTwoclassChange = (val) => {
    this.setState({
      currentData: {
        ...this.state.currentData,
        ProClassId: val,
      },
    });
  };
  handleChange = (e, type) => {
    this.setState({
      currentData: {
        ...this.state.currentData,
        [type]: e.target.value,
      },
    });
  };
  // 处理分页selectedRowKeys数据丢失
  setSelectedRows = (selectedRows, selectedRowKeys, type) => {
    const { storageSelectedRows } = this.state;
    let cloneArr = [...storageSelectedRows];
    if (type === "add") {
      selectedRows.map((v) => {
        let flag = true;
        cloneArr.map((item) => {
          if (v.proInfoId == item.proInfoId) {
            flag = false;
          }
        });
        if (flag) {
          cloneArr.push(v);
        }
      });
    } else {
      let arr = [];
      cloneArr.map((v, i) => {
        let flag = true;
        selectedRowKeys.map((item) => {
          if (v.proInfoId == item) {
            flag = false;
          }
        });
        if (!flag) {
          arr.push(v);
        }
      });
      cloneArr = arr;
    }

    return cloneArr;
  };

  handleShowModal = () => {
    this.setState({
      showModal: true,
    })
    this.init()
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      ProClassListdata,
      ProClassTwoListdata,
      total,
      postData,
      tableData,
      selectedRowKeys,
      showModal,
      selectedRows
    } = this.state;
    const pagination = {
      total,
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: postData.PageSize,
      current: postData.PageIndex,
      pageSizeOptions: ["10", "30", "50"],
      onShowSizeChange: (current, pageSize) => {
        this.setState(
          { postData: { ...postData, PageIndex: current, PageSize: pageSize } },
          () => {
            this.init();
          }
        );
      },
      onChange: (current, pageSize) => {
        this.setState(
          { postData: { ...postData, PageIndex: current, PageSize: pageSize } },
          () => {
            this.init();
          }
        );
      },
    };
    const rowSelection = {
      type: "radio",
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRowKeys,
          selectedRows: selectedRows,
          storageSelectedRowKeys: selectedRowKeys,
          storageSelectedRows: selectedRows,
        });
      },
    };

    return (
      <Fragment>
        <a onClick={() => this.handleShowModal()}>{selectedRows && selectedRows.length > 0 ? `${selectedRows[0].productName}(自营商品编码：${selectedRows[0].productId})` : '选择商品'}</a>
        {showModal && <Modal
          width={1200}
          title={"添加商品"}
          visible
          maskClosable={false}
          onCancel={this.handleClose}
          onOk={this.handelOk}
          destroyOnClose
        >
          <Form>
            <Row>
              <Col span={5}>
                <FormItem>
                  {getFieldDecorator("ProOneClassId", {
                    initialValue: undefined,
                  })(
                    <Select
                      onChange={this.ProclassChange}
                      placeholder="请选择一级分类"
                    >
                      <Option value="">请选择</Option>
                      {ProClassListdata &&
                        ProClassListdata.map((v, i) => (
                          <Option key={i} value={v.id}>
                            {v.className}
                          </Option>
                        ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={5} offset={1}>
                <FormItem>
                  {getFieldDecorator("ProClassId", {
                    initialValue: undefined,
                  })(
                    <Select
                      onChange={this.ProTwoclassChange}
                      placeholder="请选择二级分类"
                    >
                      <Option value="">请选择</Option>
                      {ProClassTwoListdata &&
                        ProClassTwoListdata.map((v, i) => (
                          <Option key={i} value={v.id}>
                            {v.className}
                          </Option>
                        ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={5} offset={1}>
                <FormItem>
                  {getFieldDecorator("ProTitle", {
                    initialValue: "",
                  })(
                    <Input
                      onChange={(e) => {
                        this.handleChange(e, "ProTitle");
                      }}
                      placeholder="自营商品名称"
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={5} offset={1}>
                <FormItem>
                  {getFieldDecorator("ProductCode", {
                    initialValue: "",
                  })(
                    <Input
                      onChange={(e) => {
                        this.handleChange(e, "ProductCode");
                      }}
                      placeholder="自营商品编码"
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <Button
                  onClick={this.init}
                  style={{ marginTop: "10px", marginRight: "10px" }}
                  type="primary"
                >
                  查询
                </Button>
                <span>请注意保证优惠券在使用时，关联的商品为上架状态</span>
              </Col>
            </Row>
            <div style={{ marginTop: "20px" }}>
              <Spin spinning={!!this.props.loading.models.productlist}>
                <Table
                  className="protable"
                  rowKey="proInfoId"
                  rowSelection={rowSelection}
                  bordered={true}
                  columns={this.columns}
                  pagination={pagination}
                  dataSource={tableData}
                />
              </Spin>
            </div>
          </Form>
        </Modal>}
      </Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
      ...state,
  };
};
const PickProductModal = Form.create() (PickProductModalWap);

export default connect(mapStateToProps)(PickProductModal);

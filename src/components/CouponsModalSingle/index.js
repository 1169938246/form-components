import React, { Component, Fragment } from "react";
import {
  Form,
  Spin,
  Modal,
  message,
} from "antd";
import { SearchForm, Table } from "fl-pro";
import { connect } from "dva";
class CouponsModalSingleWap extends Component {
  constructor(props) {
    super(props);
    const { value, couponCollectionScene } = props;
    (this.state = {
      postData: {
        pageIndex: 1,
        pageSize: 10,
        MerInfoId: localStorage.getItem('MerchantId'),
        couponCollectionScene: couponCollectionScene || 2
      },
      selectedRowKeys: [],
      selectedRows: [],
      tableData: [],
      searchConfig: [{
        label: '优惠券名称',
        type: 'Input',
        name: 'Name',
      }],
      showModal: false,
      value: value
    });
  }

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    const { postData } = this.state;
    this.props.dispatch({
      type: 'pageSetting/getMerCouponList',
      payload: {
        ...postData,
      }
    }).then(({ code, data, message: info }) => {
      if (code === "0") {
        const { list } = data;
        list.map((item) => {
          item.textData = '';
          item.textDataLong = '';
          if (this.props.value === item.merCouponId) {
            this.setState({
              selectedRowKeys: [item.merCouponId],
              selectedRows: [item]
            })
          }
        });
        this.setState({
          tableData: list,
          total: data.total
        });

      } else {
        message.error(info);
      }
    });

  }

  search = (err, value) => {
    //查询列表
    const { postData } = this.state;
    postData.pageIndex = 1;
    this.setState(
      {
        postData: { ...postData, ...value },
      },
      () => {
        this.getData();
      }
    );
  };

  handleClose = () => {
    this.setState({
      showModal: false
    })
  }

  handelOk = () => {
    const { selectedRows, selectedRowKeys } = this.state;
    const { handleSelectedRowsChange, onChange } = this.props;
    if (!selectedRowKeys.length) {
      return message.error(`请选择优惠券`);
    }
    onChange(selectedRowKeys)
    handleSelectedRowsChange && handleSelectedRowsChange(selectedRows) //对外暴露出一个 selectedRows
    this.handleClose();
  }

  handleShowModal = () => {
    this.setState({
      showModal: true,
    })
    this.getData()
  }

  render() {
    const {
      searchConfig,
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
      pageSize: postData.pageSize,
      current: postData.pageIndex,
      pageSizeOptions: ["10", "30", "50"],
      onShowSizeChange: (current, pageSize) => {
        this.setState(
          { postData: { ...postData, PageIndex: current, pageSize: pageSize } },
          () => {
            this.getData();
          }
        );
      },
      onChange: (current, pageSize) => {
        this.setState(
          { postData: { ...postData, PageIndex: current, pageSize: pageSize } },
          () => {
            this.getData();
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
          selectedRows: selectedRows
        });
      },
    };

    const columns = [
      { title: '序号', key: 'index', dataIndex: 'index', width: 80, render(text, record, index) { return index + 1 } },
      {
        title: '优惠券名称', key: 'name', dataIndex: 'name', width: 200,
      },
      {
        title: '优惠类型', width: 150, key: 'type', dataIndex: 'type',
        render(text) {
          const arr = ['', '满减券', '折扣券', '兑换券'];
          return arr[text];
        }
      },
      {
        title: '优惠内容', key: 'content', dataIndex: 'content', width: 200,
      },
    ]

    return (
      <Fragment>
        <a onClick={() => this.handleShowModal()}>{selectedRows && selectedRows.length > 0 ? `${selectedRows[0].name}` : '选择优惠券'}</a>
        {showModal && <Modal
          width={1200}
          title={"添加优惠券"}
          visible
          maskClosable={false}
          onCancel={this.handleClose}
          onOk={this.handelOk}
          destroyOnClose
        >
          <div style={{ marginTop: "20px" }}>
            <Spin spinning={!!this.props.loading.models.pageSetting}>
              <SearchForm
                searchConfig={searchConfig}
                search={this.search}
              />
              <Table
                pagination={pagination}
                rowKey="merCouponId"
                rowSelection={rowSelection}
                bordered={true}
                columns={columns}
                dataSource={tableData}
              />
            </Spin>
          </div>
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
const CouponsModalSingle = Form.create() (CouponsModalSingleWap);

export default connect(mapStateToProps)(CouponsModalSingle);
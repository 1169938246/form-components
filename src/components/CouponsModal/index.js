//  couponCollectionScene  优惠券场景值 
import React, { Component, Fragment } from "react";
import { Form, Spin, Modal, message, Popconfirm } from "antd";
import {
    // 查询组件
    SearchForm,
    Table,
} from "fl-pro";
import { getScrollWidth } from "../../utils/common";
import checkRows from "../../utils/checkRows";
import { connect } from "dva";
class CouponsModalWap extends Component {
    constructor(props) {
        super(props);
        const {couponCollectionScene} = props
        this.state = {
            postData: {
                pageIndex: 1,
                pageSize: 10,
                Status: 2,
                MerInfoId: localStorage.getItem("MerchantId"),
                isShowMemberCardCoupon: false,
                couponCollectionScene: couponCollectionScene || 2
            },
            selectedRowKeys: [],
            selectedRows: [],
            tableData: [],
            searchConfig: [
                {
                    label: "优惠券名称",
                    type: "Input",
                    name: "name",
                    placeholder: "请输入优惠券名称",
                }, {
                    label: "优惠券批次号",
                    type: "Input",
                    name: "batchNumber",
                    placeholder: "请输入优惠券批次号",
                }
            ],
            showModal: false,
            tableCouponData:[]   
        };
    }
    componentWillMount() {
        
    }

    componentWillReceiveProps(nextProps) {
        const { getMerCouponInfoPageResult } = nextProps.couponsList;
        if (getMerCouponInfoPageResult !== this.props.couponsList.getMerCouponInfoPageResult) {
            const { code, data } = getMerCouponInfoPageResult;
            if (code === '0') {
                if (this.props.value) {
                    let selectedRowKeys = [];
                    this.props.value.forEach((element) => {
                        selectedRowKeys.push(element.id);
                    });
                    this.setState({
                        selectedRowKeys: selectedRowKeys,
                        selectedRows: this.props.value,
                        tableCouponData:[...this.props.value]
                    })
                }
                return this.setState({
                    tableData: data.list.reduce((r, c) => {
                        return [
                            ...r,
                            {
                                ...c,
                                couponActivityId: c.id,
                                couponName: c.name,
                                couponContent: c.content,
                                memberReceiveCount: c.limitNum,
                            }
                        ]
                    }, []),
                    total: data.total
                });
            }
            message.error(getMerCouponInfoPageResult.message);
        }
    }

    handleOk = () => {
        const { selectedRows } = this.state;
        if (!selectedRows.length) {
            return message.error(`请选择优惠券`);
        }
        this.props.onChange(selectedRows)
        this.setState({
            showModal: false,
            tableCouponData:[...selectedRows]
        });
    };

    handleClose = () => {
        const { tableCouponData } = this.state;
        this.props.onChange(tableCouponData)
        this.setState({
            showModal: false,
        });
    };

    getData = () => {
        const { postData } = this.state;
        this.props.dispatch({ type: 'couponsList/getMerCouponInfoPage', payload: { ...postData } });
    };

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
    addProduct = () => {
        this.setState({
            showModal: true,
        });
    };
    deleteTable = (data) => {
        const { selectedRows } = this.state;
        const arr = selectedRows || []
        const productInfo = arr.filter(item => {
            return item.id !== data.id
        })
        message.success("删除成功")
        this.setState({
            selectedRows: productInfo,
            selectedRowKeys: productInfo.map(item => item.id),
            tableCouponData:[...productInfo]
        })
        this.props.onChange(productInfo)
    }
    render() {
        const {
            total,
            postData,
            tableData,
            selectedRowKeys,
            selectedRows,
            searchConfig,
            showModal,
            tableCouponData
        } = this.state;
        const pagination = {
            total,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSize: postData.pageSize,
            current: postData.pageIndex,
            pageSizeOptions: ["10", "30", "50"],
            onShowSizeChange: (pageIndex, pageSize) => {
                this.setState(
                    { postData: { ...postData, pageIndex, pageSize } },
                    () => {
                        this.getData();
                    }
                );
            },
            onChange: (pageIndex, pageSize) => {
                this.setState(
                    { postData: { ...postData, pageIndex, pageSize } },
                    () => {
                        this.getData();
                    }
                );
            },
        };

        const rowSelection = checkRows(
            this,
            selectedRowKeys,
            selectedRows,
            'couponActivityId',
        );

        const columnsTable = [
            { title: '批次号', key: 'id', dataIndex: 'id' },
            { title: '优惠券标题', key: 'couponName', dataIndex: 'couponName' },
            {
                title: '优惠券类型', key: 'type', dataIndex: 'type', render: (text, record) => {
                    let arr = ['', '满减券', '折扣券']
                    return arr[text]
                }
            },
            { title: '优惠金额', key: 'price', dataIndex: 'price' },
            { title: '使用门槛', key: 'fullPrice', dataIndex: 'fullPrice' },
            { title: '开始时间', key: 'startCouponTime', dataIndex: 'startCouponTime' },
            { title: '结束时间', key: 'endCouponTime', dataIndex: 'endCouponTime' },
            { title: '发放数量', key: 'totalNum', dataIndex: 'totalNum' },
            { title: '已发放数量', key: 'receivedNum', dataIndex: 'receivedNum' },
            {
                title: "操作",
                width: 100,
                key: "control",
                fixed:"right",
                render: (text, record) => {
                    return (
                        <Popconfirm
                        title="确认删除此条数据吗？"
                        okText="是"
                        cancelText="否"
                        onConfirm={()=>this.deleteTable(record)}
                    >
                        <a>删除</a>
                    </Popconfirm>
                    );
                },
            },
        ]

        const columns = [{ title: '批次号', key: 'batchNumber', dataIndex: 'batchNumber' },
        { title: '优惠券标题', key: 'name', dataIndex: 'name' },
        {
            title: '优惠券类型', key: 'type', dataIndex: 'type', render: (text, record) => {
                let arr = ['', '满减券', '折扣券']
                return arr[text]
            }
        },
        { title: '优惠金额', key: 'price', dataIndex: 'price' },
        { title: '使用门槛', key: 'fullPrice', dataIndex: 'fullPrice' }]
        return (
            <Fragment>
                <a onClick={this.addProduct}>添加优惠券</a>
                <Table
                    className="bannertable"
                    pagination={false}
                    rowKey="id"
                    columns={columnsTable}
                    dataSource={tableCouponData}
                    scroll={{ x: getScrollWidth(columnsTable) }}
                />
                {showModal && <Modal
                    width={1000}
                    title={"添加优惠券"}
                    visible
                    maskClosable={false}
                    onCancel={this.handleClose}
                    onOk={this.handleOk}
                    destroyOnClose
                 
                >
                    <Spin spinning={!!this.props.loading.models.couponsList}>
                        <SearchForm
                            searchConfig={searchConfig}
                            search={this.search}
                            onFieldsChange={this.onFieldsChange}
                            onRef={(r) => (this.child = r)}
                        />
                        <div style={{ marginTop: "20px" }}>
                            <Table
                                rowKey="id"
                                scroll={{ x: getScrollWidth(columns) }}
                                rowSelection={rowSelection}
                                bordered={true}
                                columns={columns}
                                pagination={pagination}
                                dataSource={tableData}
                            />
                        </div>
                    </Spin>
                </Modal> }
                

            </Fragment>

        );
    }
}

const mapStateToProps = (state) => {
    return {
        ...state,
    };
  };
const CouponsModal = Form.create() (CouponsModalWap);
  
export default connect(mapStateToProps)(CouponsModal);
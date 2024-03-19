import React, { Fragment } from "react";
import { Form, Modal, Spin, Popconfirm, message } from "antd";
import { SearchForm, Table } from "fl-pro";
import checkRows from "../../utils/checkRows";
import { getScrollWidth } from "../../utils/common";
class ProductModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            postData: {
                pageIndex: 1,
                pageSize: 10,
                MerInfoId: localStorage.getItem("MerchantId"),
            },
            searchConfig: [
                {
                    label: "商品编号",
                    type: "Input",
                    name: "platformProductId",
                    placeholder: "请输入商品编号",
                },
                {
                    label: "商品名称",
                    type: "Input",
                    name: "productName",
                    placeholder: "请输入商品名称",
                },
                {
                    label: "自营商品编码",
                    type: "Input",
                    name: "productCode",
                    placeholder: "请输入自营商品编码",
                },
            ],
            tableData: [],
            selectedRows: [],
            selectedRowKeys:[],
            showModal: false,
            tableProductData:[]
        };
    }
    componentDidMount() {
        this.init();
      }

    handleOk = () => {
        const { selectedRows } = this.state;
        if (!selectedRows.length) {
            return message.info(`请选择商品`);
        }
        this.props.onChange(selectedRows)
        this.setState({
            showModal: false,
            tableProductData:[...selectedRows]
        });
    };

    hideModal = () => {
        const { tableProductData } = this.state;
        this.props.onChange(tableProductData)
        this.setState({
            showModal: false,
        });
    };

    init = () => {
        const { postData } = this.state;
        this.props
            .dispatch({
                type: "productlist/getprodctList",
                params: {
                    ...postData,
                    proStatus: 2,
                },
            })
            .then((res) => {
                const { code, data } = res;
                if (code === "0") {
                    if (this.props.value) {
                        let selectedRowKeys = [];
                        this.props.value.forEach((element) => {
                            selectedRowKeys.push(element.proInfoId);
                        });
                        this.setState({
                            selectedRowKeys: selectedRowKeys,
                            selectedRows: this.props.value,
                            tableProductData:[...this.props.value]
                        })
                    }
                    return this.setState({
                        tableData: data.list.list,
                        total: data.list.total,
                    });
                }
                message.error(res.message);
            });
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
                this.init();
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
        this.setState({
            selectedRows: productInfo,
            selectedRowKeys: productInfo.map(item => item.id),
            tableProductData:[...productInfo]
        })
        this.props.onChange(productInfo)
    }
    render() {
        const {
            searchConfig,
            tableData,
            total,
            postData,
            selectedRowKeys,
            selectedRows,
            showModal,
            tableProductData
        } = this.state;
        const rowSelection = checkRows(this, selectedRowKeys, selectedRows, "proInfoId");
        let tableColums = [
            {
                title: "自营商品编码",
                width: 200,
                key: "proInfoId",
                dataIndex: "proInfoId",
            },
            {
                title: "商品编号",
                width: 200,
                key: "platformProductId",
                dataIndex: "platformProductId",
            },
            {
                title: "商品标题",
                width: 200,
                key: "productName",
                dataIndex: "productName",
            },
            { title: "面值", width: 80, key: "faceValue", dataIndex: "faceValue" },
            { title: "单价", width: 80, key: "price", dataIndex: "price" },
            {
                title: "商品属性",
                width: 120,
                key: "productType",
                dataIndex: "productType",
                render: (text) => {
                    const productType = {
                        3: "卡密",
                        4: "直充",
                    };
                    return <span>{productType[text]}</span>;
                },
            },
        ];

        let usertableColums = tableColums.concat([
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
        ]);


        const pagination = {
            total,
            showQuickJumper: true,
            pageSize: postData.pageSize,
            current: postData.pageIndex,
            pageSizeOptions: ["10", "30", "50"],
            onShowSizeChange: (current, pageSize) => {
                this.setState(
                    { postData: { ...postData, pageIndex: current, pageSize: pageSize } },
                    () => {
                        this.init();
                    }
                );
            },
            onChange: (current, pageSize) => {
                this.setState(
                    { postData: { ...postData, pageIndex: current, pageSize: pageSize } },
                    () => {
                        this.init();
                    }
                );
            },
        };

        return (
            <Fragment>
                <a onClick={this.addProduct}>添加商品</a>
                <Table
                    className="bannertable"
                    pagination={false}
                    rowKey="id"
                    columns={usertableColums}
                    dataSource={tableProductData}
                    scroll={{ x: getScrollWidth(usertableColums) }}
                />
                {showModal && (
                    <Modal
                        title="添加商品"
                        visible
                        maskClosable={false}
                        onOk={this.handleOk}
                        onCancel={this.hideModal}
                        width={1200}
                    >
                        <Spin spinning={!!this.props.loading.models.productlist}>
                            <SearchForm searchConfig={searchConfig} search={this.search} />
                            <Table
                                className="card-table"
                                rowSelection={rowSelection}
                                rowKey="proInfoId"
                                columns={tableColums}
                                pagination={pagination}
                                dataSource={tableData}
                                scroll={{ x: getScrollWidth(tableColums) }}
                            />
                        </Spin>
                    </Modal>
                )}
            </Fragment>
        );
    }
}

export default  Form.create()(ProductModal)
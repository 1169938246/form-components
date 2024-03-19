import React, { useEffect, useState, Fragment } from 'react';
import {
    Form,
    Button,
    Empty,
    Steps,
} from "antd";
import "./index.less"
const { Step } = Steps;
const MarketingActivityBox = ({
    leftMenu = [],
    stepsMenuTitle = [],
    stepsMenuFormItem = [],
    formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 1 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
        },
    },
    form,
    onFilnsh,
    type,
    imgUrl = "",
    isShowStep = true
}) => {
    const [tabIndex, setTabIndex] = useState(0)
    const [stepNum, setStepNum] = useState(0);
    const [formValues, setFormValues] = useState({}); //直接储存每项数据源最终作为输出数据
    const { setFieldsValue } = form;
    //解决控制台提示未定位的表单值问题
    useEffect(() => {
        Object.keys(form.getFieldsValue()).forEach(key => {
            const obj = {};
            obj[key] = formValues[key] || null;
            setFieldsValue(obj)
              })     
    }, [stepNum])
       
    const next = async () => {
        let value = await form.validateFields();
        if (value) {
            setFormValues(prev => ({
                ...prev,
                ...value
            }))
            setStepNum(prev => prev + 1)
        }
    }

    const prev = async () => {
        let value = await form.getFieldsValue();
        if (value) {
            setFormValues(prev => ({
                ...prev,
                ...value
            }))
        }
        setStepNum(prev => prev - 1)
    }

    const handelSubmit = async () => {
        let value = await form.validateFields();
        onFilnsh({ ...value, ...formValues })
    }

    const renderBtn = ()=>{
        return (
            <div className="steps-action">
            {stepNum < stepsMenuTitle.length - 1 && (
                <Fragment>
                    <Button type="primary" onClick={next}>
                        下一步
                    </Button>
                </Fragment>
            )}
            {stepNum === 0 && (
                <Button style={{ marginLeft: "8px" }} onClick={() => {
                    history.go(-1)
                }} >
                    取消
                </Button>
            )}
            {stepNum === stepsMenuTitle.length - 1 && (
                <Button type="primary" onClick={handelSubmit}>
                    保存
                </Button>
            )}
            {stepNum > 0 && (
                <Button style={{ marginLeft: 8 }} onClick={() => prev()}>
                    上一步
                </Button>
            )}
        </div>
        )
    }

    return (
        <Fragment>
            {/* 带有导航效果图步骤条的类型 */}
            {type === "navImageStepForm" &&
             <div className='marketingActivity-box'>
                <div className="add-activity-draw-left">
                    {leftMenu.map((item, index) => <div className={`item ${index === tabIndex ? 'active' : ''}`} onClick={() => setTabIndex(index)}>{item.name}</div>)}
                </div>
                <div className="add-activity-draw-center">
                    {leftMenu[tabIndex] ? <img src={leftMenu[tabIndex] && leftMenu[tabIndex].imgUrl} /> : <Empty />}
                </div>
                <div className="add-activity-draw-right">

                    <Steps current={stepNum}>
                        {stepsMenuTitle.map(item => (
                            <Step key={item} title={item} />
                        ))}
                    </Steps>

                    <div className="steps-content">
                        <Form  {...formItemLayout} >  {stepsMenuFormItem[stepNum].content()}</Form>
                    </div>
                    {renderBtn()}
                </div>
            </div>
            }

            {/* 不带导航效果图步骤条的类型 */}
            {type === "imageStepForm" &&
            <div className='marketingActivity-box'>
             {imgUrl && <div className="add-activity-draw-center">
                <img src={imgUrl} />
            </div>}
            <div className="add-activity-draw-right">
                {!!isShowStep && <Steps current={stepNum}>
                    {stepsMenuTitle.map(item => (
                        <Step key={item} title={item} />
                    ))}
                </Steps>}
                <div className="steps-content" style={{marginLeft:"0px"}}>
                    <Form  {...formItemLayout} >  {stepsMenuFormItem[stepNum].content()}</Form>
                </div>
                {isShowStep ? renderBtn(): <div className="steps-action">
                    <Button type="primary" onClick={handelSubmit}>
                        保存
                    </Button>
                    <Button style={{ marginLeft: "8px" }} onClick={() => {
                        history.go(-1)
                    }} >
                        取消
                    </Button>
                </div>}
            </div>
            </div>
            }
        </Fragment>
    );
};

export default MarketingActivityBox


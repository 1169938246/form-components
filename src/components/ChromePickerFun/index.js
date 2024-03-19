import React, { Fragment, useState, useRef, useEffect } from "react";
import { ChromePicker } from "react-color";

const ChromePickerFun = ({ value, onChange }) => {
    const [showReactColor, setShowReactColor] = useState(false);
    const couponColor = useRef()
    const cover = {
        position: "fixed",
        top: "0px",
        right: "0px",
        bottom: "0px",
        left: "0px",
    };
    const popover = {
        position: "absolute",
        zIndex: "2",
        right: "0px",
    };

    useEffect(() => {
        couponColor.current = value;
    }, [value]);

    const handleClose = () => {
        setShowReactColor(false);
    };
    const showChange = () => {
        setShowReactColor(true);
    };
    const resetColor = () => {
        setShowReactColor(false);
        couponColor.current ='#5B84C3'
        onChange('#5B84C3')
    };
    return (
        <Fragment>
            <div className="background-div">
                <div
                    className="color-div"
                    style={{ background: couponColor.current}}
                    onClick={showChange}
                ></div>
                {showReactColor ? (
                    <div style={popover}>
                        <div style={cover} onClick={handleClose} />
                        <ChromePicker
                            color={couponColor.current}
                            onChange={(e) => {
                                onChange(e.hex)
                                couponColor.current = e.hex
                            }}
                        />
                    </div>
                ) : null}
            </div>
            <a className="mar-left-width" onClick={resetColor}>
                重置
            </a>
        </Fragment>
    );
};


export default ChromePickerFun;

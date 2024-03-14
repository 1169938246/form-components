/**
 * 上传图片组件
 * @param imgSize 图片大小限制
 * @param data 上传数据
 * @param disabled 是否禁用
 */

import React, { useState,useEffect } from 'react';
import { Upload, Icon, message} from 'antd';
const UploadImage = ({
  imgSize = 50,
  data = { Directory: 'Image' },
  disabled = false,
  onChange,
  value
}) => {
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  useEffect(()=>{
    setImg();
  },[value])

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('只能上传图片文件!');
      return false;
    }

    const isLt4M = file.size / 1024 < imgSize;
    if (!isLt4M) {
      message.error(`图片大小不能超过${imgSize}KB!`);
      onChange('')
    }
    
    return isLt4M;
  };

  const uploadConfig = {
    action: `${configs.host.test}/api/FileUpload/Upload`,
    listType: 'picture-card',
    onChange(info) {
      setFileList(info.fileList);

      if (info.file.status === 'uploading') {
        setLoading(true);
        return;
      }

      if (info.file.status === 'done') {
        if (info.file.response.code === '0') {
          message.success(`${info.file.name} 上传完成`);
          onChange(info.file.response.data)
         
        } else {
          onChange('')
          message.error(`${info.file.name} 上传失败`);
          
        }
      }
    },
    onRemove() {
      setLoading(false);
      onChange('')
    },
  };

  const setImg = () => {
    if(value){
         setFileList([
        {
          uid: 1,
          name: 'xxx.jpg',
          status: 'done',
          url: value,
        },
      ]);
    }else{
      setFileList([]);
    }
  };

  return (
    <Upload
    {...uploadConfig}
    name="filename"
    data={{ ...data, merchantId: localStorage.getItem('MerchantId') }}
    defaultFileList={fileList}
    fileList={fileList}
    beforeUpload={beforeUpload}
    disabled={disabled}
  >
    {fileList.length > 0 ? null : (
      <div>
        <Icon type={loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传</div>
      </div>
    )}

  </Upload>
  );
};

export default UploadImage;

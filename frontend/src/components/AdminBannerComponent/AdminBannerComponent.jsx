// import React from 'react'
import React, { use, useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Image, message, Upload } from 'antd';
// import type { GetProp, UploadFile, UploadProps } from 'antd';
import * as BannerService from '../../services/BannerService.js';
import { useSelector } from 'react-redux';
import { WrapperHeader } from './Style.js';

const AdminBannerComponent = () => {

  const user = useSelector((state) => state?.user);

  const getBase64 = file =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState([]);

  const fetchAllBanner = async () => {
    const res = await BannerService.getAllBanner();
    setFileList(res?.data?.map(item => ({
      uid: item._id,
      name: item.name,
      status: 'done',
      url: item.image,
      thumbUrl: item.image,
    })));
  }


  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || (file.preview));
    setPreviewOpen(true);
  };


  const handleCustomUpload = async ({ file, onSuccess, onError }) => {
    try {
      const base64 = await getBase64(file);
      const res = await BannerService.createBanner({ image: base64 }, JSON.parse(user?.access_token));

      if (res.status === 'OK') {
        message.success('Tải lên banner thành công');
        await fetchAllBanner(); // Đồng bộ lại danh sách
        onSuccess('OK');
      } else {
        message.error('Tải lên thất bại');
        onError(new Error('Upload failed'));
      }
    } catch (error) {
      console.error('Upload error:', error);
      message.error('Lỗi khi tải lên');
      onError(error);
    }
  };


  const handleDeleteBanner = async (id) => {
    try {
      const res = await BannerService.deleteBanner(id, JSON.parse(user?.access_token));
      if (res.status === 'OK') {
        message.success('Xóa banner thành công');
      } else {
        message.error('Failed to delete banner');
      }
      fetchAllBanner();
    } catch (error) {
      console.error('Error deleting banner:', error);
    }
  }

  useEffect(() => {
    fetchAllBanner();
  }, []);


  return (
    <>
      <WrapperHeader>Quản lý banner</WrapperHeader>

      <Upload
        listType="picture-card"
        fileList={fileList}
        customRequest={handleCustomUpload}
        onPreview={handlePreview}
        onChange={({ fileList }) => setFileList(fileList)}
        onRemove={(file) => { handleDeleteBanner(file.uid) }}
      >
        {fileList.length >= 10 ? null : ( // Hiển thị nút tải lên nếu số lượng file ít hơn 10
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        )}
      </Upload>
      {previewImage && (
        <Image
          wrapperStyle={{ display: 'none' }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(''),
          }}
          src={previewImage}
        />
      )}
    </>
  )
}

export default AdminBannerComponent

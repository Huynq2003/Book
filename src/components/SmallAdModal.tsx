// SmallAdModal.tsx
import React, { useEffect, useState } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';

const SmallAdModal: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose  = () => {
    setIsVisible(false);
  };
  useEffect(() => {
    const timer = setTimeout(handleClose, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isVisible && (
        <div className="fixed bottom-20 right-4 bg-white z-40 rounded-lg shadow-lg p-4 animate-shake animate-bounce">
          {/* Nội dung modal */}
          <div className="flex justify-between items-center">
            <div>
              <img
                src="https://cf.shopee.vn/file/vn-11134258-7ras8-m0o78c9u2a5pcf"
                alt="Ad Banner"
                className="w-[80px]"
              />
            </div>
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={handleClose}
              className="text-red-500 absolute top-[-12px] right-[-5px] m-1"
            />
          </div>
          <div className="flex justify-center gap-3 mt-4">
            {/* Nút Messenger */}
            <a
              href="https://m.me/your-messenger-id"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-btn messenger-btn"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Facebook_Messenger_logo_2020.svg/800px-Facebook_Messenger_logo_2020.svg.png"
                alt="Messenger"
                className="w-6 h-6"
              />
            </a>

            {/* Nút Zalo */}
            <a
              href="https://zalo.me/your-zalo-id"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-btn zalo-btn"
            >
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMDg68zSJU2TpKyMFJwkWpuGsXF_FTMJguqA&s"
                alt="Zalo"
                className="w-6 h-6"
              />
            </a>
          </div>
        </div>
        
      )}
      
    </>
  );
};

export default SmallAdModal;

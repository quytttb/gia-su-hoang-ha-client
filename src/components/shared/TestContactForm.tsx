import React, { useState } from 'react';
import { saveContactMessage } from '../../services/contactService';
import { useToastContext } from '../../contexts/ToastContext';

const TestContactForm: React.FC = () => {
     const [loading, setLoading] = useState(false);
     const toast = useToastContext();

     const testMessages = [
          {
               name: 'Nguyễn Thị Mai',
               email: 'mai.nguyen@email.com',
               phone: '0987654321',
               message: 'Chào anh/chị, con tôi đang học lớp 12 và cần gia sư môn Toán để ôn thi đại học.'
          },
          {
               name: 'Trần Văn Nam',
               email: 'nam.tran@gmail.com',
               phone: '0912345678',
               message: 'Em muốn đăng ký học tiếng Anh giao tiếp cho sinh viên.'
          },
          {
               name: 'Lê Thị Hương',
               email: 'huong.le@yahoo.com',
               phone: '0945678912',
               message: 'Tôi muốn hỏi về lịch học và học phí của lớp Vật lý THPT.'
          }
     ];

     const handleAddTestMessages = async () => {
          setLoading(true);

          try {
               console.log('🚀 Starting to add test messages...');

               for (const msg of testMessages) {
                    console.log(`📝 Adding message from ${msg.name}...`);

                    const result = await saveContactMessage(
                         msg.name,
                         msg.email,
                         msg.phone,
                         msg.message
                    );

                    if (result.success) {
                         console.log(`✅ Successfully added message from ${msg.name}, ID: ${result.id}`);
                    } else {
                         console.error(`❌ Failed to add message from ${msg.name}:`, result.error);
                    }
               }

               toast.success('Thành công!', 'Đã thêm tin nhắn test vào cơ sở dữ liệu');
          } catch (error) {
               console.error('💥 Error adding test messages:', error);
               toast.error('Lỗi!', 'Không thể thêm tin nhắn test: ' + (error as Error).message);
          } finally {
               setLoading(false);
          }
     };

     return (
          <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border z-50">
               <h3 className="text-sm font-medium mb-2">Test Contact Messages</h3>
               <button
                    onClick={handleAddTestMessages}
                    disabled={loading}
                    className="px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50"
               >
                    {loading ? 'Đang thêm...' : 'Thêm tin nhắn test'}
               </button>
          </div>
     );
};

export default TestContactForm;

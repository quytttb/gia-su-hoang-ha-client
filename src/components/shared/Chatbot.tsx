import { useState, useEffect, useRef, FormEvent } from 'react';

export type ChatMessage = {
     id: string;
     content: string;
     isBot: boolean;
};

export type ChatbotFAQ = {
     keywords: string[];
     question: string;
     answer: string;
};

interface ChatbotProps {
     faqs?: ChatbotFAQ[];
}

const defaultFAQs: ChatbotFAQ[] = [
     {
          keywords: ['giờ', 'làm việc', 'mở cửa', 'đóng cửa'],
          question: 'Trung tâm mở cửa những giờ nào?',
          answer: `Trung tâm mở cửa: \n- Thứ 2 - Thứ 6: 7:30 - 20:00\n- Thứ 7 - Chủ nhật: 8:00 - 17:00`
     },
     {
          keywords: ['học phí', 'giá', 'tiền', 'thanh toán', 'phí'],
          question: 'Học phí các khóa học là bao nhiêu?',
          answer: 'Học phí các khóa học dao động từ 1.800.000đ đến 4.000.000đ tùy vào loại khóa học. Vui lòng xem chi tiết tại trang Khóa học hoặc liên hệ với chúng tôi để biết thêm chi tiết.'
     },
     {
          keywords: ['đăng ký', 'tham gia', 'ghi danh'],
          question: 'Làm thế nào để đăng ký khóa học?',
          answer: 'Để đăng ký khóa học, bạn có thể: 1) Đăng ký trực tuyến trên trang web của chúng tôi tại mục Khóa học, 2) Liên hệ trực tiếp qua số điện thoại 0385.510.892 - 0962.390.161, hoặc 3) Đến trực tiếp trung tâm tại 265 - ĐƯỜNG 06 - MẶT BẰNG 08, PHƯỜNG NAM NGẠN, THÀNH PHỐ THANH HOÁ, TỈNH THANH HOÁ.'
     },
     {
          keywords: ['địa chỉ', 'nơi', 'vị trí', 'đâu'],
          question: 'Trung tâm nằm ở đâu?',
          answer: `Địa chỉ của chúng tôi là: 265 - ĐƯỜNG 06 - MẶT BẰNG 08, PHƯỜNG NAM NGẠN, THÀNH PHỐ THANH HOÁ, TỈNH THANH HOÁ`
     },
     {
          keywords: ['liên hệ', 'gọi', 'số', 'email'],
          question: 'Làm thế nào để liên hệ với trung tâm?',
          answer: `Bạn có thể liên hệ với chúng tôi qua:\n- Điện thoại: 0385.510.892 - 0962.390.161\n- Email: lienhe@giasuhoangha.com\n- Hoặc đến trực tiếp tại: 265 - ĐƯỜNG 06 - MẶT BẰNG 08, PHƯỜNG NAM NGẠN, THÀNH PHỐ THANH HOÁ, TỈNH THANH HOÁ`
     },
     {
          keywords: ['giáo viên', 'giảng viên', 'gia sư'],
          question: 'Giáo viên tại trung tâm có kinh nghiệm không?',
          answer: 'Giáo viên tại trung tâm Gia Sư Hoàng Hà đều có trình độ chuyên môn cao, nhiều năm kinh nghiệm giảng dạy. Nhiều giáo viên có bằng Thạc sĩ, Tiến sĩ và các chứng chỉ chuyên môn.'
     },
     {
          keywords: ['lịch học', 'thời khóa biểu'],
          question: 'Lịch học được sắp xếp như thế nào?',
          answer: 'Lịch học được sắp xếp linh hoạt dựa trên từng khóa học. Thông thường, các lớp học diễn ra vào buổi tối các ngày trong tuần hoặc cả ngày vào cuối tuần. Bạn có thể xem chi tiết lịch học tại trang Lịch học trên website.'
     },
     {
          keywords: ['hỗ trợ', 'thêm', 'bổ trợ'],
          question: 'Trung tâm có các dịch vụ hỗ trợ học tập nào?',
          answer: 'Ngoài các khóa học chính, chúng tôi còn cung cấp các dịch vụ hỗ trợ như: gia sư 1-1, lớp học bổ trợ, tài liệu học tập online, và các buổi ôn tập định kỳ.'
     },
     {
          keywords: ['hoàn tiền', 'đổi khóa', 'hủy'],
          question: 'Chính sách hoàn tiền của trung tâm là gì?',
          answer: 'Trung tâm có chính sách hoàn tiền nếu học viên không hài lòng sau 3 buổi học đầu tiên. Học viên cũng có thể đổi sang khóa học khác có giá trị tương đương. Vui lòng liên hệ với chúng tôi để biết thêm chi tiết.'
     }
];

const Chatbot = ({ faqs = defaultFAQs }: ChatbotProps) => {
     const [isChatOpen, setIsChatOpen] = useState(false);
     const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
          {
               id: '1',
               content: 'Xin chào! Tôi là trợ lý ảo của Trung tâm Gia Sư Hoàng Hà. Tôi có thể giúp gì cho bạn?',
               isBot: true
          }
     ]);
     const [userInput, setUserInput] = useState('');
     const [chatLoading, setChatLoading] = useState(false);
     const messagesEndRef = useRef<HTMLDivElement>(null);

     useEffect(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
     }, [chatMessages]);

     const handleChatInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          setUserInput(e.target.value);
     };

     const handleSendMessage = (e: FormEvent) => {
          e.preventDefault();
          if (!userInput.trim()) return;
          const newUserMessage: ChatMessage = {
               id: Date.now().toString(),
               content: userInput,
               isBot: false
          };
          setChatMessages(prev => [...prev, newUserMessage]);
          setUserInput('');
          setChatLoading(true);
          setTimeout(() => {
               const botResponse = generateBotResponse(userInput);
               setChatMessages(prev => [...prev, botResponse]);
               setChatLoading(false);
          }, 500);
     };

     const generateBotResponse = (input: string): ChatMessage => {
          const lowercaseInput = input.toLowerCase();
          for (const faq of faqs) {
               for (const keyword of faq.keywords) {
                    if (lowercaseInput.includes(keyword)) {
                         return {
                              id: Date.now().toString(),
                              content: faq.answer,
                              isBot: true
                         };
                    }
               }
          }
          if (lowercaseInput.includes('xin chào') || lowercaseInput.includes('hi') || lowercaseInput.includes('hello')) {
               return {
                    id: Date.now().toString(),
                    content: 'Xin chào! Tôi có thể giúp gì cho bạn về các khóa học tại Trung tâm Gia Sư Hoàng Hà?',
                    isBot: true
               };
          }
          if (lowercaseInput.includes('cảm ơn') || lowercaseInput.includes('thank')) {
               return {
                    id: Date.now().toString(),
                    content: 'Không có gì! Rất vui được giúp đỡ bạn. Nếu bạn có câu hỏi nào khác, đừng ngại hỏi tôi nhé.',
                    isBot: true
               };
          }
          return {
               id: Date.now().toString(),
               content: 'Tôi chưa hiểu rõ câu hỏi của bạn. Bạn có thể hỏi về học phí, lịch học, đăng ký khóa học, địa chỉ trung tâm, hoặc thông tin liên hệ.',
               isBot: true
          };
     };

     const toggleChat = () => {
          setIsChatOpen(!isChatOpen);
     };

     return (
          <div className={`fixed bottom-6 right-6 z-50 ${isChatOpen ? 'w-80 md:w-96' : 'w-16 h-16'}`}>
               {isChatOpen ? (
                    <div className="bg-white rounded-lg shadow-xl flex flex-col h-[500px] overflow-hidden border border-gray-200">
                         {/* Chat Header */}
                         <div className="bg-primary text-white p-4 flex justify-between items-center">
                              <div className="flex items-center">
                                   <h3 className="text-lg font-semibold">Trợ lý Hoàng Hà</h3>
                              </div>
                              <button
                                   onClick={toggleChat}
                                   className="text-white hover:text-gray-200"
                              >
                                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                   </svg>
                              </button>
                         </div>
                         {/* Chat Messages */}
                         <div className="flex-1 overflow-y-auto p-4 space-y-4">
                              {chatMessages.map(message => (
                                   <div
                                        key={message.id}
                                        className={`max-w-[80%] p-3 rounded-lg ${message.isBot
                                             ? 'bg-gray-100 text-gray-800 rounded-br-none self-start'
                                             : 'bg-primary text-white rounded-bl-none self-end ml-auto'
                                             }`}
                                   >
                                        {message.content}
                                   </div>
                              ))}
                              {chatLoading && (
                                   <div className="flex space-x-1 p-3 max-w-[80%] bg-gray-100 rounded-lg">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                                   </div>
                              )}
                              <div ref={messagesEndRef} />
                         </div>
                         {/* Chat Input */}
                         <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-4 flex">
                              <input
                                   type="text"
                                   value={userInput}
                                   onChange={handleChatInputChange}
                                   className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                   placeholder="Nhập câu hỏi của bạn..."
                              />
                              <button
                                   type="submit"
                                   className="bg-primary text-white px-4 py-2 rounded-r-lg hover:bg-blue-600"
                              >
                                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                                   </svg>
                              </button>
                         </form>
                    </div>
               ) : (
                    <button
                         onClick={toggleChat}
                         className="bg-primary text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                         </svg>
                    </button>
               )}
          </div>
     );
};

export default Chatbot; 
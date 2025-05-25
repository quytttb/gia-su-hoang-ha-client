import { useState, useEffect, useRef, FormEvent } from 'react';
import {
  trackChatbotOpen,
  trackChatbotClose,
  trackQuickReplyClick
} from '../../utils/chatbotAnalytics';

export type ChatMessage = {
  id: string;
  content: string;
  isBot: boolean;
  type?: 'text' | 'quick-reply' | 'contact' | 'facebook';
  quickReplies?: string[];
};

export type ChatbotFAQ = {
  keywords: string[];
  question: string;
  answer: string;
  type?: 'text' | 'contact' | 'facebook';
  quickReplies?: string[];
};

interface ChatbotProps {
  faqs?: ChatbotFAQ[];
}

const defaultFAQs: ChatbotFAQ[] = [
  {
    keywords: ['giờ', 'làm việc', 'mở cửa', 'đóng cửa', 'thời gian'],
    question: 'Trung tâm mở cửa những giờ nào?',
    answer: `🕐 **Giờ làm việc của trung tâm:**\n\n📅 **Thứ 2 - Thứ 6:** 7:30 - 20:00\n📅 **Thứ 7 - Chủ nhật:** 8:00 - 17:00\n\n💡 *Bạn có thể đến trực tiếp hoặc gọi điện trong giờ làm việc!*`,
    quickReplies: ['Xem khóa học', 'Liên hệ ngay', 'Địa chỉ trung tâm'],
  },
  {
    keywords: ['học phí', 'giá', 'tiền', 'thanh toán', 'phí', 'chi phí'],
    question: 'Học phí các khóa học là bao nhiêu?',
    answer: `💰 **Bảng học phí tham khảo:**\n\n📚 **Luyện thi THPT:** 2.500.000đ - 4.000.000đ\n📖 **Ôn thi Đại học:** 3.000.000đ - 4.500.000đ\n✏️ **Bổ trợ kiến thức:** 1.800.000đ - 2.800.000đ\n👥 **Gia sư 1-1:** 3.500.000đ - 5.000.000đ\n\n🎁 *Hiện có nhiều chương trình ưu đãi hấp dẫn!*`,
    quickReplies: ['Xem chi tiết khóa học', 'Đăng ký tư vấn', 'Chương trình ưu đãi'],
  },
  {
    keywords: ['đăng ký', 'tham gia', 'ghi danh', 'đăng kí'],
    question: 'Làm thế nào để đăng ký khóa học?',
    answer: `📝 **3 cách đăng ký dễ dàng:**\n\n🌐 **Online:** Đăng ký trực tuyến trên website\n📞 **Hotline:** 0385.510.892 - 0962.390.161\n🏢 **Trực tiếp:** Đến trung tâm tại Thanh Hóa\n\n✨ *Đăng ký ngay để nhận ưu đãi đặc biệt!*`,
    type: 'contact',
    quickReplies: ['Đăng ký online', 'Gọi hotline', 'Xem địa chỉ'],
  },
  {
    keywords: ['địa chỉ', 'nơi', 'vị trí', 'đâu', 'chỗ nào'],
    question: 'Trung tâm nằm ở đâu?',
    answer: `📍 **Địa chỉ trung tâm:**\n\n🏢 265 - Đường 06 - Mặt Bằng 08\nPhường Nam Ngạn, TP Thanh Hóa\nTỉnh Thanh Hóa\n\n🚗 *Gần trung tâm thành phố, dễ dàng di chuyển!*`,
    quickReplies: ['Xem bản đồ', 'Hướng dẫn đường đi', 'Liên hệ'],
  },
  {
    keywords: ['liên hệ', 'gọi', 'số', 'email', 'facebook', 'fb'],
    question: 'Làm thế nào để liên hệ với trung tâm?',
    answer: `📞 **Thông tin liên hệ:**\n\n☎️ **Hotline:** 0385.510.892 - 0962.390.161\n📧 **Email:** lienhe@giasuhoangha.com\n📱 **Facebook:** Gia Sư Hoàng Hà Official\n🏢 **Địa chỉ:** 265 Đường 06, Nam Ngạn, Thanh Hóa\n\n💬 *Chúng tôi luôn sẵn sàng hỗ trợ bạn!*`,
    type: 'facebook',
    quickReplies: ['Gọi ngay', 'Gửi email', 'Nhắn Facebook', 'Đến trung tâm'],
  },
  {
    keywords: ['giáo viên', 'giảng viên', 'gia sư', 'thầy', 'cô'],
    question: 'Giáo viên tại trung tâm có kinh nghiệm không?',
    answer: `👨‍🏫 **Đội ngũ giáo viên chất lượng:**\n\n🎓 **Trình độ:** Thạc sĩ, Tiến sĩ các trường ĐH hàng đầu\n⭐ **Kinh nghiệm:** 5-15 năm giảng dạy\n🏆 **Thành tích:** Nhiều học sinh đỗ ĐH top đầu\n💡 **Phương pháp:** Hiện đại, phù hợp từng học sinh\n\n✨ *100% giáo viên được tuyển chọn kỹ lưỡng!*`,
    quickReplies: ['Xem giáo viên', 'Đăng ký học thử', 'Tư vấn khóa học'],
  },
  {
    keywords: ['lịch học', 'thời khóa biểu', 'ca học', 'buổi học'],
    question: 'Lịch học được sắp xếp như thế nào?',
    answer: `📅 **Lịch học linh hoạt:**\n\n🌅 **Sáng:** 7:30 - 11:30 (Chủ nhật)\n🌇 **Chiều:** 13:30 - 17:30 (Thứ 7 - CN)\n🌃 **Tối:** 18:00 - 21:00 (T2 - T6)\n\n⚡ **Đặc biệt:** Có thể sắp xếp lịch riêng theo yêu cầu\n\n📱 *Xem lịch chi tiết trên website!*`,
    quickReplies: ['Xem lịch học', 'Đăng ký lịch riêng', 'Tư vấn thời gian'],
  },
  {
    keywords: ['hỗ trợ', 'thêm', 'bổ trợ', 'dịch vụ'],
    question: 'Trung tâm có các dịch vụ hỗ trợ học tập nào?',
    answer: `🎯 **Dịch vụ hỗ trợ đa dạng:**\n\n👨‍🎓 **Gia sư 1-1:** Học riêng với giáo viên\n📚 **Lớp bổ trợ:** Củng cố kiến thức\n💻 **Tài liệu online:** Học mọi lúc mọi nơi\n📝 **Ôn tập định kỳ:** Kiểm tra tiến độ\n🎯 **Tư vấn học tập:** Lộ trình cá nhân hóa\n\n🌟 *Cam kết hỗ trợ tối đa cho học sinh!*`,
    quickReplies: ['Gia sư 1-1', 'Lớp bổ trợ', 'Tài liệu online'],
  },
  {
    keywords: ['hoàn tiền', 'đổi khóa', 'hủy', 'chính sách'],
    question: 'Chính sách hoàn tiền của trung tâm là gì?',
    answer: `💯 **Chính sách linh hoạt:**\n\n✅ **Hoàn tiền 100%** nếu không hài lòng sau 3 buổi đầu\n🔄 **Đổi khóa học** miễn phí (cùng giá trị)\n⏰ **Bảo lưu học phí** đến 6 tháng\n📞 **Hỗ trợ 24/7** giải quyết thắc mắc\n\n🤝 *Cam kết minh bạch, uy tín!*`,
    quickReplies: ['Tìm hiểu thêm', 'Liên hệ tư vấn', 'Đăng ký ngay'],
  },
  {
    keywords: ['facebook', 'fb', 'fanpage', 'mạng xã hội'],
    question: 'Facebook của trung tâm là gì?',
    answer: `📱 **Kết nối với chúng tôi trên Facebook:**\n\n👍 **Fanpage chính thức:** Gia Sư Hoàng Hà\n📢 **Cập nhật:** Tin tức, khuyến mãi mới nhất\n💬 **Tương tác:** Hỏi đáp trực tiếp\n📸 **Hình ảnh:** Hoạt động học tập tại trung tâm\n\n🔗 *Nhấn nút bên dưới để truy cập Facebook!*`,
    type: 'facebook',
    quickReplies: ['Truy cập Facebook', 'Nhắn tin Facebook', 'Theo dõi fanpage'],
  },
];

// Function to parse markdown-like formatting
const parseMarkdown = (text: string) => {
  // Split text by lines to preserve line breaks
  const lines = text.split('\n');

  return lines.map((line, lineIndex) => {
    const parts = [];
    let currentIndex = 0;

    // Check if line is a bullet point
    const isBulletPoint = line.trim().startsWith('•') || line.trim().startsWith('-');
    const bulletContent = isBulletPoint ? line.trim().substring(1).trim() : line;
    const textToProcess = isBulletPoint ? bulletContent : line;

    // Find all bold text patterns **text**
    const boldRegex = /\*\*(.*?)\*\*/g;
    let match;

    while ((match = boldRegex.exec(textToProcess)) !== null) {
      // Add text before the bold part
      if (match.index > currentIndex) {
        parts.push(
          <span key={`text-${lineIndex}-${currentIndex}`}>
            {textToProcess.slice(currentIndex, match.index)}
          </span>
        );
      }

      // Add the bold part
      parts.push(
        <strong key={`bold-${lineIndex}-${match.index}`} className="font-semibold text-gray-900">
          {match[1]}
        </strong>
      );

      currentIndex = match.index + match[0].length;
    }

    // Add remaining text after the last bold part
    if (currentIndex < textToProcess.length) {
      parts.push(
        <span key={`text-${lineIndex}-${currentIndex}`}>{textToProcess.slice(currentIndex)}</span>
      );
    }

    // If no bold text found, return the original line
    if (parts.length === 0) {
      parts.push(<span key={`line-${lineIndex}`}>{textToProcess}</span>);
    }

    // Wrap in appropriate container
    const content = isBulletPoint ? (
      <div key={`line-${lineIndex}`} className="flex items-start space-x-2 ml-2">
        <span className="text-blue-600 font-bold mt-0.5">•</span>
        <div>{parts}</div>
      </div>
    ) : (
      <div key={`line-${lineIndex}`}>{parts}</div>
    );

    return (
      <>
        {content}
        {lineIndex < lines.length - 1 && !isBulletPoint && <br />}
      </>
    );
  });
};

const Chatbot = ({ faqs = defaultFAQs }: ChatbotProps) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content:
        '👋 **Xin chào! Tôi là trợ lý ảo của Trung tâm Gia Sư Hoàng Hà.**\n\n💡 Tôi có thể giúp bạn:\n• Tìm hiểu về khóa học\n• Xem học phí và lịch học\n• Hướng dẫn đăng ký\n• Thông tin liên hệ\n\n❓ **Bạn muốn hỏi gì?**',
      isBot: true,
      type: 'quick-reply',
      quickReplies: ['Xem khóa học', 'Học phí', 'Đăng ký', 'Liên hệ', 'Facebook'],
    },
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

  const handleQuickReply = (reply: string) => {
    trackQuickReplyClick(reply);

    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      content: reply,
      isBot: false,
    };
    setChatMessages(prev => [...prev, newUserMessage]);
    setChatLoading(true);

    setTimeout(() => {
      const botResponse = generateBotResponse(reply);
      setChatMessages(prev => [...prev, botResponse]);
      setChatLoading(false);
    }, 500);
  };

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      content: userInput,
      isBot: false,
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

  const openFacebookPage = () => {
    window.open('https://www.facebook.com/profile.php?id=61575087818708', '_blank');
  };

  const generateBotResponse = (input: string): ChatMessage => {
    const lowercaseInput = input.toLowerCase();

    // Handle Facebook-related queries
    if (
      lowercaseInput.includes('facebook') ||
      lowercaseInput.includes('fb') ||
      lowercaseInput.includes('fanpage') ||
      lowercaseInput.includes('truy cập facebook') ||
      lowercaseInput.includes('nhắn tin facebook') ||
      lowercaseInput.includes('theo dõi fanpage')
    ) {
      return {
        id: Date.now().toString(),
        content: `📱 **Kết nối với Gia Sư Hoàng Hà trên Facebook!**\n\n👍 **Fanpage chính thức** với nhiều thông tin hữu ích:\n• 📢 Tin tức và khuyến mãi mới nhất\n• 📸 Hình ảnh hoạt động học tập\n• 💬 Tương tác trực tiếp với trung tâm\n• 🎓 Chia sẻ kinh nghiệm học tập\n\n🔗 **Nhấn nút bên dưới để truy cập!**`,
        isBot: true,
        type: 'facebook',
        quickReplies: ['Truy cập Facebook', 'Liên hệ khác', 'Quay lại menu chính'],
      };
    }

    // Handle contact-related queries
    if (lowercaseInput.includes('gọi ngay') || lowercaseInput.includes('hotline')) {
      return {
        id: Date.now().toString(),
        content: `📞 **Liên hệ ngay với chúng tôi:**\n\n☎️ **Hotline 1:** 0385.510.892\n☎️ **Hotline 2:** 0962.390.161\n\n🕐 **Giờ hỗ trợ:**\n• T2-T6: 7:30 - 20:00\n• T7-CN: 8:00 - 17:00\n\n💡 *Gọi ngay để được tư vấn miễn phí!*`,
        isBot: true,
        type: 'contact',
        quickReplies: ['Gửi email', 'Xem địa chỉ', 'Facebook', 'Menu chính'],
      };
    }

    // Search through FAQs
    for (const faq of faqs) {
      for (const keyword of faq.keywords) {
        if (lowercaseInput.includes(keyword)) {
          return {
            id: Date.now().toString(),
            content: faq.answer,
            isBot: true,
            type: faq.type || 'quick-reply',
            quickReplies: faq.quickReplies || ['Tìm hiểu thêm', 'Liên hệ tư vấn', 'Menu chính'],
          };
        }
      }
    }

    // Handle greetings
    if (
      lowercaseInput.includes('xin chào') ||
      lowercaseInput.includes('hi') ||
      lowercaseInput.includes('hello') ||
      lowercaseInput.includes('chào')
    ) {
      return {
        id: Date.now().toString(),
        content: `👋 **Xin chào! Rất vui được hỗ trợ bạn!**\n\n🎯 **Tôi có thể giúp bạn:**\n• 📚 Thông tin các khóa học\n• 💰 Bảng giá học phí\n• 📅 Lịch học và đăng ký\n• 📞 Thông tin liên hệ\n• 📱 Kết nối Facebook\n\n❓ **Bạn muốn tìm hiểu về điều gì?**`,
        isBot: true,
        type: 'quick-reply',
        quickReplies: ['Khóa học', 'Học phí', 'Đăng ký', 'Liên hệ', 'Facebook'],
      };
    }

    // Handle thanks
    if (lowercaseInput.includes('cảm ơn') || lowercaseInput.includes('thank')) {
      return {
        id: Date.now().toString(),
        content: `🙏 **Không có gì! Rất vui được giúp đỡ bạn.**\n\n✨ **Nếu bạn cần hỗ trợ thêm:**\n• 📞 Gọi hotline: 0385.510.892\n• 📱 Nhắn tin Facebook\n• 🏢 Đến trực tiếp trung tâm\n\n💪 **Chúc bạn học tập hiệu quả!**`,
        isBot: true,
        type: 'quick-reply',
        quickReplies: ['Hỏi thêm', 'Liên hệ', 'Facebook', 'Kết thúc'],
      };
    }

    // Handle menu requests
    if (
      lowercaseInput.includes('menu') ||
      lowercaseInput.includes('quay lại') ||
      lowercaseInput.includes('menu chính')
    ) {
      return {
        id: Date.now().toString(),
        content: `📋 **Menu chính - Chọn thông tin bạn cần:**\n\n🎯 **Các chủ đề phổ biến:**`,
        isBot: true,
        type: 'quick-reply',
        quickReplies: ['Khóa học', 'Học phí', 'Đăng ký', 'Liên hệ', 'Facebook', 'Giáo viên'],
      };
    }

    // Default response
    return {
      id: Date.now().toString(),
      content: `🤔 **Tôi chưa hiểu rõ câu hỏi của bạn.**\n\n💡 **Bạn có thể hỏi về:**\n• 📚 Khóa học và chương trình\n• 💰 Học phí và ưu đãi\n• 📝 Cách đăng ký\n• 📞 Thông tin liên hệ\n• 📱 Facebook fanpage\n\n❓ **Hoặc chọn chủ đề bên dưới:**`,
      isBot: true,
      type: 'quick-reply',
      quickReplies: ['Khóa học', 'Học phí', 'Đăng ký', 'Liên hệ', 'Facebook'],
    };
  };

  const toggleChat = () => {
    if (!isChatOpen) {
      trackChatbotOpen();
    } else {
      trackChatbotClose();
    }
    setIsChatOpen(!isChatOpen);
  };

  const renderMessage = (message: ChatMessage) => {
    const isBot = message.isBot;

    return (
      <div key={message.id} className="space-y-2">
        <div
          className={`max-w-[85%] p-3 rounded-lg ${isBot
            ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-800 rounded-br-none border border-blue-100'
            : 'bg-gradient-to-r from-primary to-blue-600 text-white rounded-bl-none ml-auto'
            }`}
        >
          <div className="whitespace-pre-line text-sm leading-relaxed">
            {parseMarkdown(message.content)}
          </div>
        </div>

        {/* Quick Replies */}
        {isBot && message.quickReplies && (
          <div className="flex flex-wrap gap-2 max-w-[85%]">
            {message.quickReplies.map((reply, index) => (
              <button
                key={index}
                onClick={() => handleQuickReply(reply)}
                className="px-3 py-1.5 text-xs bg-white border border-primary text-primary rounded-full hover:bg-primary hover:text-white transition-colors duration-200"
              >
                {reply}
              </button>
            ))}
          </div>
        )}

        {/* Facebook Button */}
        {isBot && message.type === 'facebook' && (
          <div className="max-w-[85%]">
            <button
              onClick={openFacebookPage}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Truy cập Facebook Fanpage</span>
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${isChatOpen ? 'w-80 md:w-96' : 'w-16 h-16'}`}>
      {isChatOpen ? (
        <div className="bg-white rounded-lg shadow-2xl flex flex-col h-[600px] overflow-hidden border border-gray-200">
          {/* Enhanced Chat Header */}
          <div className="bg-gradient-to-r from-primary to-blue-600 text-white p-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Trợ lý Hoàng Hà</h3>
                <p className="text-xs text-blue-100">Luôn sẵn sàng hỗ trợ bạn</p>
              </div>
            </div>
            <button
              onClick={toggleChat}
              className="text-white hover:text-blue-200 transition-colors duration-200"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {chatMessages.map(renderMessage)}
            {chatLoading && (
              <div className="flex space-x-1 p-3 max-w-[85%] bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: '0.1s' }}
                ></div>
                <div
                  className="w-2 h-2 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                ></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Enhanced Chat Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <input
                type="text"
                value={userInput}
                onChange={handleChatInputChange}
                placeholder="Nhập câu hỏi của bạn..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              />
              <button
                type="submit"
                disabled={!userInput.trim()}
                className="px-4 py-2 bg-primary text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* Enhanced Chat Toggle Button */
        <button
          onClick={toggleChat}
          className="w-16 h-16 bg-gradient-to-r from-primary to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center group"
        >
          <svg
            className="w-8 h-8 group-hover:scale-110 transition-transform duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          {/* Notification dot */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs text-white font-bold">!</span>
          </div>
        </button>
      )}
    </div>
  );
};

export default Chatbot;

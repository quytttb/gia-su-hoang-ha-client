import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Chatbot from '../components/shared/Chatbot';

const TutorSearchPage = () => {
     const navigate = useNavigate();

     const handleSelectTutorType = (type: 'teacher' | 'student') => {
          navigate(`/tutor-search/register?type=${type}`);
     };

     return (
          <Layout>
               {/* Hero Section */}
               <section
                    className="relative flex items-center justify-center min-h-[220px] md:min-h-[260px] bg-[#e3f0ff] dark:bg-gradient-to-b dark:from-[#182848] dark:to-[#35577d] py-8 md:py-10 overflow-hidden shadow-md border-b border-blue-200 dark:border-blue-900"
                    aria-labelledby="tutor-search-hero-heading"
               >
                    {/* Logo background mờ */}
                    <img
                         src="/images/logo.png"
                         alt="Logo Gia Sư Hoàng Hà"
                         className="absolute inset-0 m-auto w-[260px] h-[260px] md:w-[320px] md:h-[320px] opacity-20 dark:opacity-25 pointer-events-none select-none z-0"
                         style={{ left: '0', right: '0', top: '0', bottom: '0', filter: 'brightness(1.15)' }}
                    />
                    {/* Overlay phù hợp với cả 2 mode */}
                    <div className="absolute inset-0 bg-white/70 dark:bg-white/10 z-10"></div>
                    <div className="container-custom relative z-20 flex flex-col items-center justify-center h-full">
                         <div className="flex flex-col items-center justify-center h-full">
                              <h1
                                   id="tutor-search-hero-heading"
                                   className="text-4xl md:text-5xl font-bold mb-4 text-primary-700 dark:text-primary-500 drop-shadow-md"
                                   style={{ whiteSpace: 'nowrap' }}
                              >
                                   Tìm Gia sư phù hợp
                              </h1>
                              <p className="text-xl md:text-2xl font-semibold text-accent-600 dark:text-accent-500 max-w-4xl mx-auto mb-0" style={{ whiteSpace: 'nowrap' }}>
                                   Bạn muốn tìm Gia sư nào? Hãy chọn bên dưới nhé!
                              </p>
                         </div>
                    </div>
               </section>
               <div className="container-custom py-8 pb-8">
                    <div className="max-w-5xl mx-auto">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              {/* Gia sư giáo viên */}
                              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col">
                                   <div className="p-8 flex-1 flex flex-col">
                                        <div className="text-center mb-6">
                                             <div className="w-full flex justify-center mb-4">
                                                  <img
                                                       src="/images/gia-su-giao-vien.jpg"
                                                       alt="Gia sư Giáo viên"
                                                       className="rounded-lg object-cover max-h-40 w-auto shadow"
                                                       style={{ aspectRatio: '1.475', background: '#f3f4f6' }}
                                                  />
                                             </div>
                                             <h3 className="text-2xl font-bold text-black dark:text-white mb-2">
                                                  Gia sư Giáo viên
                                             </h3>
                                             <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4">
                                                  250,000đ<span className="text-lg font-normal text-gray-600 dark:text-gray-400">/buổi</span>
                                             </div>
                                        </div>

                                        <div className="space-y-3 mb-8">
                                             <div className="flex items-center">
                                                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                  </svg>
                                                  <span className="text-black dark:text-white">Giáo viên nhiều năm kinh nghiệm</span>
                                             </div>
                                             <div className="flex items-center">
                                                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                  </svg>
                                                  <span className="text-black dark:text-white">Chuyên môn vững vàng</span>
                                             </div>
                                             <div className="flex items-center">
                                                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                  </svg>
                                                  <span className="text-black dark:text-white">Phương pháp đa dạng và chuyên sâu</span>
                                             </div>
                                             <div className="flex items-center">
                                                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                  </svg>
                                                  <span className="text-black dark:text-white">Phù hợp với Học sinh mất gốc hoặc chinh phục 9+</span>
                                             </div>
                                        </div>

                                        <button
                                             onClick={() => handleSelectTutorType('teacher')}
                                             className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                                        >
                                             Chọn Gia sư Giáo viên
                                        </button>
                                   </div>
                              </div>

                              {/* Gia sư sinh viên */}
                              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col">
                                   <div className="p-8 flex-1 flex flex-col">
                                        <div className="text-center mb-6">
                                             <div className="w-full flex justify-center mb-4">
                                                  <img
                                                       src="/images/gia-su-sinh-vien.jpg"
                                                       alt="Gia sư Sinh viên"
                                                       className="rounded-lg object-cover max-h-40 w-auto shadow"
                                                       style={{ aspectRatio: '1.475', background: '#f3f4f6' }}
                                                  />
                                             </div>
                                             <h3 className="text-2xl font-bold text-black dark:text-white mb-2">
                                                  Gia sư Sinh viên
                                             </h3>
                                             <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-4">
                                                  160,000đ<span className="text-lg font-normal text-gray-600 dark:text-gray-400">/buổi</span>
                                             </div>
                                        </div>

                                        <div className="space-y-3 mb-8">
                                             <div className="flex items-center">
                                                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                  </svg>
                                                  <span className="text-black dark:text-white">Sinh viên giỏi của Trường Đại học Hồng Đức</span>
                                             </div>
                                             <div className="flex items-center">
                                                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                  </svg>
                                                  <span className="text-black dark:text-white">Trẻ, gần gũi, dễ dàng thấu hiểu tâm lý Học sinh</span>
                                             </div>
                                             <div className="flex items-center">
                                                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                  </svg>
                                                  <span className="text-black dark:text-white">Học phí rẻ hợp lý</span>
                                             </div>
                                             <div className="flex items-center">
                                                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                  </svg>
                                                  <span className="text-black dark:text-white">Lịch học linh hoạt, chủ động</span>
                                             </div>
                                        </div>

                                        <button
                                             onClick={() => handleSelectTutorType('student')}
                                             className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                                        >
                                             Chọn Gia sư Sinh viên
                                        </button>
                                   </div>
                              </div>
                         </div>

                         {/* Thông tin thêm */}
                         <div className="mt-12 bg-gray-50 dark:bg-gray-800 rounded-xl p-8">
                              <h3 className="text-2xl font-bold text-black dark:text-white mb-4 text-center">
                                   Quy trình tìm Gia sư
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                   <div className="text-center">
                                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                                             <span className="text-xl font-bold text-blue-600 dark:text-blue-400">1</span>
                                        </div>
                                        <h4 className="font-semibold text-black dark:text-white mb-2">Đăng ký</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Điền thông tin và yêu cầu</p>
                                   </div>
                                   <div className="text-center">
                                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                                             <span className="text-xl font-bold text-blue-600 dark:text-blue-400">2</span>
                                        </div>
                                        <h4 className="font-semibold text-black dark:text-white mb-2">Tư vấn</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Nhân viên tư vấn chi tiết</p>
                                   </div>
                                   <div className="text-center">
                                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                                             <span className="text-xl font-bold text-blue-600 dark:text-blue-400">3</span>
                                        </div>
                                        <h4 className="font-semibold text-black dark:text-white mb-2">Chọn lọc</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Tìm Gia sư phù hợp nhất</p>
                                   </div>
                                   <div className="text-center">
                                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                                             <span className="text-xl font-bold text-blue-600 dark:text-blue-400">4</span>
                                        </div>
                                        <h4 className="font-semibold text-black dark:text-white mb-2">Học thử</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Dạy thử miễn phí 1 buổi</p>
                                   </div>
                              </div>
                         </div>
                    </div>
               </div>
               <Chatbot />
          </Layout>
     );
};

export default TutorSearchPage;
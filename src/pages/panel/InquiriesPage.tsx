import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import PanelLayout from '../../components/panel/layout/PanelLayout';
import SkeletonLoading from '../../components/shared/SkeletonLoading';
import { useNotificationContext } from '../../contexts/NotificationContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
     faEnvelope,
     faEnvelopeOpen,
     faTrash,
     faEye,
     faEyeSlash,
     faPhone,
     faUser,
     faCalendarAlt,
     faReply,
     faPaperPlane,
     faTimes
} from '@fortawesome/free-solid-svg-icons';
import { ContactMessage } from '../../services/contactService';
import { sendReplyEmail } from '../../services/replyService';

const InquiriesPage: React.FC = () => {
     const [messages, setMessages] = useState<(ContactMessage & { id: string })[]>([]);
     const [loading, setLoading] = useState(true);
     const [selectedMessage, setSelectedMessage] = useState<(ContactMessage & { id: string }) | null>(null);
     const [filter, setFilter] = useState<'all' | 'new' | 'read' | 'replied'>('all');
     const { refreshNotifications } = useNotificationContext();

     // Reply form states
     const [isReplying, setIsReplying] = useState(false);
     const [replySubject, setReplySubject] = useState('');
     const [replyMessage, setReplyMessage] = useState('');
     const [sendingReply, setSendingReply] = useState(false);

     const fetchMessages = async () => {
          try {
               if (!db) {
                    console.error('Database not initialized');
                    return;
               }

               const messagesQuery = query(
                    collection(db, 'contacts'),
                    orderBy('createdAt', 'desc')
               );

               const snapshot = await getDocs(messagesQuery);
               const fetchedMessages = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
               })) as (ContactMessage & { id: string })[];

               setMessages(fetchedMessages);
          } catch (error) {
               console.error('Error fetching messages:', error);
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => {
          fetchMessages();
     }, []);

     const updateMessageStatus = async (messageId: string, status: ContactMessage['status']) => {
          try {
               if (!db) return;

               await updateDoc(doc(db, 'contacts', messageId), {
                    status,
                    updatedAt: new Date()
               });

               setMessages(prev =>
                    prev.map(msg =>
                         msg.id === messageId ? { ...msg, status } : msg
                    )
               );

               // Update selectedMessage if it's the same message
               if (selectedMessage && selectedMessage.id === messageId) {
                    setSelectedMessage(prev => prev ? { ...prev, status } : null);
               }

               // Refresh notifications in header
               refreshNotifications();
          } catch (error) {
               console.error('Error updating message status:', error);
          }
     };

     const deleteMessage = async (messageId: string) => {
          if (!confirm('Bạn có chắc chắn muốn xóa tin nhắn này?')) return;

          try {
               if (!db) return;

               await deleteDoc(doc(db, 'contacts', messageId));
               setMessages(prev => prev.filter(msg => msg.id !== messageId));
               setSelectedMessage(null);
          } catch (error) {
               console.error('Error deleting message:', error);
          }
     };

     const handleMessageClick = async (message: ContactMessage & { id: string }) => {
          setSelectedMessage(message);

          // Auto-mark as read if it's new
          if (message.status === 'new') {
               await updateMessageStatus(message.id, 'read');
          }
     };



     const toggleReadStatus = async (messageId: string, currentStatus: ContactMessage['status']) => {
          const newStatus = currentStatus === 'new' ? 'read' : 'new';
          await updateMessageStatus(messageId, newStatus);
     };

     const startReply = (message: ContactMessage & { id: string }) => {
          setIsReplying(true);
          setReplySubject(`Re: Yêu cầu từ ${message.name}`);
          setReplyMessage(`Xin chào ${message.name},\n\nCảm ơn bạn đã liên hệ với chúng tôi.\n\n`);
     };

     const cancelReply = () => {
          setIsReplying(false);
          setReplySubject('');
          setReplyMessage('');
     };

     const sendReply = async () => {
          if (!selectedMessage || !replyMessage.trim()) return;

          setSendingReply(true);
          try {
               // Send email using reply service
               await sendReplyEmail({
                    to_email: selectedMessage.email,
                    to_name: selectedMessage.name,
                    subject: replySubject,
                    message: replyMessage
               });

               // Update message status to replied
               await updateMessageStatus(selectedMessage.id, 'replied');

               // Reset reply form
               cancelReply();

               alert('Đã gửi phản hồi thành công!');
          } catch (error) {
               console.error('Error sending reply:', error);
               alert('Có lỗi xảy ra khi gửi phản hồi. Vui lòng thử lại.');
          } finally {
               setSendingReply(false);
          }
     };

     const filteredMessages = messages.filter(message => {
          if (filter === 'all') return true;
          return message.status === filter;
     });

     const getStatusColor = (status: ContactMessage['status']) => {
          switch (status) {
               case 'new': return 'text-blue-600 bg-blue-100';
               case 'read': return 'text-yellow-600 bg-yellow-100';
               case 'replied': return 'text-green-600 bg-green-100';
               case 'closed': return 'text-gray-600 bg-gray-100';
               default: return 'text-gray-600 bg-gray-100';
          }
     };

     const getStatusText = (status: ContactMessage['status']) => {
          switch (status) {
               case 'new': return 'Mới';
               case 'read': return 'Đã đọc';
               case 'replied': return 'Đã trả lời';
               case 'closed': return 'Đã đóng';
               default: return 'Không xác định';
          }
     };

     const formatDate = (timestamp: any) => {
          if (!timestamp) return 'N/A';

          let date;
          if (timestamp.toDate) {
               date = timestamp.toDate();
          } else if (timestamp instanceof Date) {
               date = timestamp;
          } else {
               date = new Date(timestamp);
          }

          return date.toLocaleString('vi-VN');
     };

     return (
          <PanelLayout>
               <div className="space-y-6">
                    {/* Page Header */}
                    <div className="bg-card rounded-lg p-6 border">
                         <h2 className="text-2xl font-bold text-foreground mb-2">Quản lý Tin nhắn</h2>
                         <p className="text-muted-foreground">
                              Xem và trả lời các tin nhắn, yêu cầu từ khách hàng.
                         </p>
                    </div>

                    {/* Filters */}
                    <div className="bg-card rounded-lg p-4 border">
                         <div className="flex gap-2 flex-wrap">
                              {[
                                   { key: 'all', label: 'Tất cả', count: messages.length },
                                   { key: 'new', label: 'Mới', count: messages.filter(m => m.status === 'new').length },
                                   { key: 'read', label: 'Đã đọc', count: messages.filter(m => m.status === 'read').length },
                                   { key: 'replied', label: 'Đã trả lời', count: messages.filter(m => m.status === 'replied').length },
                              ].map(({ key, label, count }) => (
                                   <button
                                        key={key}
                                        onClick={() => setFilter(key as any)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === key
                                             ? 'bg-blue-500 text-white'
                                             : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                             }`}
                                   >
                                        {label} ({count})
                                   </button>
                              ))}
                         </div>
                    </div>

                    {/* Messages List */}
                    {loading ? (
                         <div className="bg-card rounded-lg p-6 border">
                              <SkeletonLoading type="table-row" count={8} />
                         </div>
                    ) : filteredMessages.length === 0 ? (
                         <div className="bg-card rounded-lg p-12 border text-center">
                              <FontAwesomeIcon icon={faEnvelope} className="text-6xl text-gray-300 mb-4" />
                              <h3 className="text-xl font-semibold text-foreground mb-2">Chưa có tin nhắn</h3>
                              <p className="text-muted-foreground">
                                   {filter === 'all'
                                        ? 'Chưa có tin nhắn nào từ khách hàng.'
                                        : `Chưa có tin nhắn nào với trạng thái "${getStatusText(filter as any)}".`
                                   }
                              </p>
                         </div>
                    ) : (
                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              {/* Messages List */}
                              <div className="space-y-4">
                                   {filteredMessages.map((message) => (
                                        <div
                                             key={message.id}
                                             className={`bg-card rounded-lg p-4 border cursor-pointer transition-all hover:shadow-md ${selectedMessage?.id === message.id ? 'ring-2 ring-blue-500' : ''
                                                  }`}
                                             onClick={() => handleMessageClick(message)}
                                        >
                                             <div className="flex items-start justify-between mb-2">
                                                  <div className="flex items-center gap-2">
                                                       <FontAwesomeIcon
                                                            icon={message.status === 'new' ? faEnvelope : faEnvelopeOpen}
                                                            className={`text-lg ${message.status === 'new' ? 'text-blue-500' : 'text-gray-400'}`}
                                                       />
                                                       <h3 className="font-semibold text-foreground">{message.name}</h3>
                                                  </div>
                                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
                                                       {getStatusText(message.status)}
                                                  </span>
                                             </div>

                                             <div className="space-y-1 text-sm text-muted-foreground mb-3">
                                                  <div className="flex items-center gap-2">
                                                       <FontAwesomeIcon icon={faUser} className="w-3 h-3" />
                                                       <span>{message.email}</span>
                                                  </div>
                                                  <div className="flex items-center gap-2">
                                                       <FontAwesomeIcon icon={faPhone} className="w-3 h-3" />
                                                       <span>{message.phone}</span>
                                                  </div>
                                                  <div className="flex items-center gap-2">
                                                       <FontAwesomeIcon icon={faCalendarAlt} className="w-3 h-3" />
                                                       <span>{formatDate(message.createdAt)}</span>
                                                  </div>
                                             </div>

                                             <p className="text-sm text-muted-foreground line-clamp-2">
                                                  {message.message}
                                             </p>
                                        </div>
                                   ))}
                              </div>

                              {/* Message Detail */}
                              <div className="lg:sticky lg:top-6">
                                   {selectedMessage ? (
                                        <div className="bg-card rounded-lg p-6 border">
                                             <div className="flex items-start justify-between mb-4">
                                                  <h3 className="text-lg font-semibold text-foreground">Chi tiết tin nhắn</h3>
                                                  <div className="flex gap-2">
                                                       <button
                                                            onClick={() => toggleReadStatus(selectedMessage.id, selectedMessage.status)}
                                                            className={`p-2 transition-colors ${selectedMessage.status === 'new'
                                                                 ? 'text-blue-500 hover:text-blue-600'
                                                                 : 'text-gray-500 hover:text-blue-500'
                                                                 }`}
                                                            title={selectedMessage.status === 'new' ? 'Đánh dấu đã đọc' : 'Đánh dấu chưa đọc'}
                                                       >
                                                            <FontAwesomeIcon
                                                                 icon={selectedMessage.status === 'new' ? faEye : faEyeSlash}
                                                            />
                                                       </button>
                                                       <button
                                                            onClick={() => startReply(selectedMessage)}
                                                            className="p-2 text-gray-500 hover:text-green-500 transition-colors"
                                                            title="Trả lời tin nhắn"
                                                       >
                                                            <FontAwesomeIcon icon={faReply} />
                                                       </button>
                                                       <button
                                                            onClick={() => deleteMessage(selectedMessage.id)}
                                                            className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                                                            title="Xóa tin nhắn"
                                                       >
                                                            <FontAwesomeIcon icon={faTrash} />
                                                       </button>
                                                  </div>
                                             </div>

                                             <div className="space-y-4">
                                                  <div>
                                                       <label className="text-sm font-medium text-muted-foreground">Trạng thái</label>
                                                       <div className="mt-1">
                                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedMessage.status)}`}>
                                                                 {getStatusText(selectedMessage.status)}
                                                            </span>
                                                       </div>
                                                  </div>

                                                  <div>
                                                       <label className="text-sm font-medium text-muted-foreground">Họ tên</label>
                                                       <p className="mt-1 text-foreground">{selectedMessage.name}</p>
                                                  </div>

                                                  <div>
                                                       <label className="text-sm font-medium text-muted-foreground">Email</label>
                                                       <p className="mt-1 text-foreground">
                                                            <a href={`mailto:${selectedMessage.email}`} className="text-blue-500 hover:underline">
                                                                 {selectedMessage.email}
                                                            </a>
                                                       </p>
                                                  </div>

                                                  <div>
                                                       <label className="text-sm font-medium text-muted-foreground">Số điện thoại</label>
                                                       <p className="mt-1 text-foreground">
                                                            <a href={`tel:${selectedMessage.phone}`} className="text-blue-500 hover:underline">
                                                                 {selectedMessage.phone}
                                                            </a>
                                                       </p>
                                                  </div>

                                                  <div>
                                                       <label className="text-sm font-medium text-muted-foreground">Thời gian gửi</label>
                                                       <p className="mt-1 text-foreground">{formatDate(selectedMessage.createdAt)}</p>
                                                  </div>

                                                  <div>
                                                       <label className="text-sm font-medium text-muted-foreground">Tin nhắn</label>
                                                       <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                            <p className="text-foreground whitespace-pre-wrap">{selectedMessage.message}</p>
                                                       </div>
                                                  </div>

                                                  {selectedMessage.userAgent && (
                                                       <div>
                                                            <label className="text-sm font-medium text-muted-foreground">Thông tin trình duyệt</label>
                                                            <p className="mt-1 text-xs text-muted-foreground">{selectedMessage.userAgent}</p>
                                                       </div>
                                                  )}
                                             </div>

                                             {/* Reply Form */}
                                             {isReplying && (
                                                  <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                                                       <div className="flex items-center justify-between mb-4">
                                                            <h4 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                                                 <FontAwesomeIcon icon={faReply} />
                                                                 Trả lời tin nhắn
                                                            </h4>
                                                            <button
                                                                 onClick={cancelReply}
                                                                 className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                                                                 title="Hủy"
                                                            >
                                                                 <FontAwesomeIcon icon={faTimes} />
                                                            </button>
                                                       </div>

                                                       <div className="space-y-4">
                                                            <div>
                                                                 <label className="block text-sm font-medium text-foreground mb-2">
                                                                      Tiêu đề
                                                                 </label>
                                                                 <input
                                                                      type="text"
                                                                      value={replySubject}
                                                                      onChange={(e) => setReplySubject(e.target.value)}
                                                                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-foreground"
                                                                      placeholder="Tiêu đề email..."
                                                                 />
                                                            </div>

                                                            <div>
                                                                 <label className="block text-sm font-medium text-foreground mb-2">
                                                                      Nội dung phản hồi
                                                                 </label>
                                                                 <textarea
                                                                      value={replyMessage}
                                                                      onChange={(e) => setReplyMessage(e.target.value)}
                                                                      rows={6}
                                                                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-foreground resize-none"
                                                                      placeholder="Nhập nội dung phản hồi..."
                                                                 />
                                                            </div>

                                                            <div className="flex gap-3">
                                                                 <button
                                                                      onClick={sendReply}
                                                                      disabled={sendingReply || !replyMessage.trim()}
                                                                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                                 >
                                                                      <FontAwesomeIcon icon={faPaperPlane} />
                                                                      {sendingReply ? 'Đang gửi...' : 'Gửi phản hồi'}
                                                                 </button>
                                                                 <button
                                                                      onClick={cancelReply}
                                                                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                                                                 >
                                                                      Hủy
                                                                 </button>
                                                            </div>
                                                       </div>
                                                  </div>
                                             )}
                                        </div>
                                   ) : (
                                        <div className="bg-card rounded-lg p-12 border text-center">
                                             <FontAwesomeIcon icon={faEnvelope} className="text-4xl text-gray-300 mb-4" />
                                             <p className="text-muted-foreground">Chọn một tin nhắn để xem chi tiết</p>
                                        </div>
                                   )}
                              </div>
                         </div>
                    )}
               </div>
          </PanelLayout>
     );
};

export default InquiriesPage;
import { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import SectionHeading from '../components/shared/SectionHeading';
import { Schedule } from '../types';
import {
  getAllSchedules,
  getSchedulesByDate,
  getSchedulesByUserPhone,
} from '../services/dataService';
import { formatDate } from '../utils/helpers';
import { updateSEO, seoData } from '../utils/seo';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format, parseISO } from 'date-fns';
import Chatbot from '../components/shared/Chatbot';

// Define types for calendar data
type CalendarValue = Date | [Date, Date] | null;
type ViewType = 'table' | 'calendar';

const SchedulePage = () => {
  const [filteredSchedules, setFilteredSchedules] = useState<Schedule[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [phone, setPhone] = useState('');
  const [personalSchedules, setPersonalSchedules] = useState<Schedule[]>([]);
  const [showPersonalSchedules, setShowPersonalSchedules] = useState(false);
  const [loading, setLoading] = useState(true);
  const [phoneSubmitted, setPhoneSubmitted] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [calendarValue, setCalendarValue] = useState<CalendarValue>(null);
  const [viewType, setViewType] = useState<ViewType>('table');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Update SEO for schedule page
    updateSEO(seoData.schedule);

    const fetchSchedules = async () => {
      try {
        setLoading(true);
        setError(null);
        const schedulesData = await getAllSchedules();

        // Extract unique dates and sort them
        const uniqueDates = Array.from(
          new Set(schedulesData.map(schedule => schedule.date))
        ).sort();

        setAvailableDates(uniqueDates);

        // Set the first date as selected by default if available
        if (uniqueDates.length > 0) {
          setSelectedDate(uniqueDates[0]);

          // Also set the calendar default value to the first date
          if (uniqueDates[0]) {
            setCalendarValue(parseISO(uniqueDates[0]));
          }
        }
      } catch (error) {
        console.error('Error fetching schedules:', error);
        setError('Không thể tải dữ liệu lịch học. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  useEffect(() => {
    const fetchSchedulesByDate = async () => {
      if (!selectedDate) return;

      try {
        setLoading(true);
        setError(null);
        const filtered = await getSchedulesByDate(selectedDate);
        setFilteredSchedules(filtered);
      } catch (error) {
        console.error('Error fetching schedules by date:', error);
        setError('Không thể tải dữ liệu lịch học cho ngày đã chọn. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchSchedulesByDate();
  }, [selectedDate]);

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  const handleCalendarChange = (value: CalendarValue) => {
    setCalendarValue(value);
    if (value instanceof Date) {
      const formattedDate = format(value, 'yyyy-MM-dd');
      setSelectedDate(formattedDate);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
    setPhoneError('');
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone.trim()) {
      setPhoneError('Vui lòng nhập số điện thoại');
      return;
    }

    // Basic Vietnamese phone number validation
    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(phone)) {
      setPhoneError('Số điện thoại không hợp lệ');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const personalSchedulesData = await getSchedulesByUserPhone(phone);
      setPersonalSchedules(personalSchedulesData);
      setShowPersonalSchedules(true);
      setPhoneSubmitted(true);
    } catch (error) {
      console.error('Error fetching personal schedules:', error);
      setError('Không thể tải dữ liệu lịch học cá nhân. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const resetPersonalSchedules = () => {
    setShowPersonalSchedules(false);
    setPersonalSchedules([]);
    setPhone('');
    setPhoneSubmitted(false);
  };

  // Function to highlight dates with schedules on the calendar
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const formattedDate = format(date, 'yyyy-MM-dd');
      return availableDates.includes(formattedDate) ? 'bg-blue-100 text-blue-800' : null;
    }
    return null;
  };

  // Toggle between table and calendar views
  const toggleView = (type: ViewType) => {
    setViewType(type);
  };

  if (loading && !phoneSubmitted) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gray-100 py-16">
        <div className="container-custom text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Lịch Học</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Xem lịch học của trung tâm hoặc kiểm tra lịch học cá nhân của bạn
          </p>
        </div>
      </section>

      <div className="container-custom py-12">
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p>{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <SectionHeading title="Lịch học theo ngày" centered={false} />

              <div className="flex space-x-2">
                <button
                  onClick={() => toggleView('table')}
                  className={`px-4 py-2 rounded ${viewType === 'table' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Dạng bảng
                </button>
                <button
                  onClick={() => toggleView('calendar')}
                  className={`px-4 py-2 rounded ${viewType === 'calendar' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Lịch
                </button>
              </div>
            </div>

            {viewType === 'table' ? (
              <>
                {/* Date Selection */}
                <div className="mb-8">
                  <div className="flex flex-wrap gap-2 mb-6">
                    {availableDates.map(date => (
                      <button
                        key={date}
                        onClick={() => handleDateChange(date)}
                        className={`px-4 py-2 rounded-md ${
                          selectedDate === date
                            ? 'bg-primary text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        } transition-colors`}
                      >
                        {formatDate(date)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Schedule Table */}
                {filteredSchedules.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full bg-white rounded-lg shadow-md">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="py-3 px-4 text-left">Khóa học</th>
                          <th className="py-3 px-4 text-left">Thời gian</th>
                          <th className="py-3 px-4 text-left">Giáo viên</th>
                          <th className="py-3 px-4 text-left">Phòng</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredSchedules.map(schedule => (
                          <tr key={schedule.id} className="border-t border-gray-200">
                            <td className="py-3 px-4 font-medium">{schedule.courseName}</td>
                            <td className="py-3 px-4">
                              {schedule.startTime} - {schedule.endTime}
                            </td>
                            <td className="py-3 px-4">{schedule.tutor}</td>
                            <td className="py-3 px-4">{schedule.room}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="bg-white p-8 rounded-lg shadow-md text-center">
                    <p className="text-gray-500">Không có lịch học nào vào ngày đã chọn.</p>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-6">
                  <p className="text-gray-600 mb-4">Chọn ngày trên lịch để xem chi tiết:</p>
                  <div className="calendar-container">
                    <Calendar
                      onChange={value => handleCalendarChange(value as CalendarValue)}
                      value={calendarValue}
                      tileClassName={tileClassName}
                    />
                  </div>
                </div>

                {selectedDate && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-lg mb-4">
                      Lịch học ngày {formatDate(selectedDate)}
                    </h3>

                    {filteredSchedules.length > 0 ? (
                      <div className="space-y-4">
                        {filteredSchedules.map(schedule => (
                          <div key={schedule.id} className="border-l-4 border-primary pl-4 py-2">
                            <p className="font-medium">{schedule.courseName}</p>
                            <p className="text-sm text-gray-600">
                              {schedule.startTime} - {schedule.endTime} | {schedule.tutor} | Phòng:{' '}
                              {schedule.room}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">
                        Không có lịch học nào vào ngày đã chọn.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <SectionHeading title="Lịch học cá nhân" centered={false} />

            {!showPersonalSchedules ? (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-gray-700 mb-4">
                  Nhập số điện thoại của bạn để xem lịch học cá nhân.
                </p>

                <form onSubmit={handlePhoneSubmit}>
                  <div className="mb-4">
                    <label htmlFor="phone" className="block text-gray-700 font-medium mb-1">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={phone}
                      onChange={handlePhoneChange}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                        phoneError ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Nhập số điện thoại của bạn"
                    />
                    {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
                  </div>

                  <button type="submit" className="btn-primary w-full" disabled={loading}>
                    {loading ? 'Đang tìm kiếm...' : 'Tìm kiếm'}
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-800">Lịch học của bạn</h3>
                  <button
                    onClick={resetPersonalSchedules}
                    className="text-sm text-primary hover:text-blue-700"
                  >
                    Tìm kiếm khác
                  </button>
                </div>

                {personalSchedules.length > 0 ? (
                  <div className="space-y-4">
                    {personalSchedules.map(schedule => (
                      <div
                        key={schedule.id}
                        className="border-b border-gray-200 pb-4 last:border-0"
                      >
                        <p className="font-medium text-gray-800">{schedule.courseName}</p>
                        <p className="text-sm text-gray-600">Ngày: {formatDate(schedule.date)}</p>
                        <p className="text-sm text-gray-600">
                          Giờ: {schedule.startTime} - {schedule.endTime}
                        </p>
                        <p className="text-sm text-gray-600">Giáo viên: {schedule.tutor}</p>
                        <p className="text-sm text-gray-600">Phòng: {schedule.room}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500">
                      Không tìm thấy lịch học nào cho số điện thoại này.
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Nếu bạn đã đăng ký, vui lòng kiểm tra lại số điện thoại hoặc liên hệ với trung
                      tâm.
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="mt-6 bg-gray-100 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-3">Thông tin liên hệ</h3>
              <p className="text-gray-700 text-sm mb-2">
                Nếu bạn gặp vấn đề khi xem lịch học, vui lòng liên hệ với chúng tôi:
              </p>
              <p className="text-gray-700 text-sm">Điện thoại: 0385.510.892 - 0962.390.161</p>
              <p className="text-gray-700 text-sm">Email: lienhe@giasuhoangha.com</p>
            </div>
          </div>
        </div>
      </div>
      <Chatbot />
    </Layout>
  );
};

export default SchedulePage;

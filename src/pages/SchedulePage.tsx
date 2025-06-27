import { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import SectionHeading from '../components/shared/SectionHeading';
import { Schedule } from '../types';
import schedulesService from '../services/firestore/schedulesService';
import { formatDate } from '../utils/helpers';
import { updateSEO, seoData } from '../utils/seo';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../components/schedule/calendar.css';
import { format, parseISO } from 'date-fns';
import Chatbot from '../components/shared/Chatbot';
import SkeletonLoading from '../components/shared/SkeletonLoading';

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

  // Enhanced calendar view with better navigation
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showCalendarEvents, setShowCalendarEvents] = useState(false);

  // Enhanced search and filter state
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterTutor, setFilterTutor] = useState('all');
  const [availableTutors, setAvailableTutors] = useState<string[]>([]);

  useEffect(() => {
    // Update SEO for schedule page
    updateSEO(seoData.schedule);

    const fetchSchedules = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get available dates from Firestore
        const uniqueDates = await schedulesService.getAvailableDates();
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
        const filtered = await schedulesService.getByDate(selectedDate);
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

  // Extract unique tutors for filtering
  useEffect(() => {
    if (filteredSchedules.length > 0) {
      const tutors = Array.from(new Set(filteredSchedules.map(s => s.tutorName))).filter(Boolean);
      setAvailableTutors(tutors);
    }
  }, [filteredSchedules]);

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
      const personalSchedulesData = await schedulesService.getByUserPhone(phone);
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

  // Navigate months
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  // Get events for calendar
  const getEventsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return filteredSchedules.filter(schedule => schedule.startDate === dateStr);
  };

  // Enhanced tile content for calendar
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const events = getEventsForDate(date);
      if (events.length > 0) {
        return (
          <div className="text-xs mt-1">
            <div className="bg-primary text-white rounded px-1 py-0.5 text-center">
              {events.length} lịch
            </div>
          </div>
        );
      }
    }
    return null;
  };

  // Enhanced filtering logic
  const applyAdvancedFilters = (schedules: Schedule[]) => {
    let filtered = [...schedules];

    // Apply search filter
    if (searchKeyword) {
      filtered = filtered.filter(schedule =>
        schedule.className.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        schedule.tutorName.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    // Apply tutor filter
    if (filterTutor !== 'all') {
      filtered = filtered.filter(schedule => schedule.tutorName === filterTutor);
    }

    return filtered;
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchKeyword('');
    setFilterTutor('all');
  };

  if (loading && !phoneSubmitted) {
    return (
      <Layout>
        <section className="bg-gray-100 dark:bg-gray-900 py-16">
          <div className="container-custom text-center">
            <SkeletonLoading type="text" count={2} className="mx-auto" />
          </div>
        </section>

        <div className="container-custom py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="mb-8">
                <SkeletonLoading type="text" count={1} className="w-1/3" />
              </div>

              <div className="mb-8 flex justify-between">
                {[...Array(3)].map((_, i) => (
                  <SkeletonLoading key={i} type="button" width="100px" />
                ))}
              </div>

              <div className="mb-8">
                <SkeletonLoading type="table-row" count={5} />
              </div>
            </div>

            <div>
              <div className="mb-6">
                <SkeletonLoading type="text" count={1} />
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <SkeletonLoading type="text" count={3} />
                <div className="mt-4">
                  <SkeletonLoading type="button" width="100%" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section
        className="relative flex items-center justify-center min-h-[220px] md:min-h-[260px] bg-[#e3f0ff] dark:bg-gradient-to-b dark:from-[#182848] dark:to-[#35577d] py-8 md:py-10 overflow-hidden shadow-md border-b border-blue-200 dark:border-blue-900"
        aria-labelledby="schedule-hero-heading"
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
              id="schedule-hero-heading"
              className="text-4xl md:text-5xl font-bold mb-4 text-primary-700 dark:text-primary-500 drop-shadow-md"
              style={{ whiteSpace: 'nowrap' }}
            >
              Lịch Học
            </h1>
            <p className="text-xl md:text-2xl font-semibold text-accent-600 dark:text-accent-500 max-w-4xl mx-auto mb-0" style={{ whiteSpace: 'nowrap' }}>
              Xem lịch học các lớp và tra cứu lịch cá nhân
            </p>
          </div>
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

            {/* Advanced Search and Filters */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Tìm kiếm</label>
                  <input
                    type="text"
                    placeholder="Tìm lớp, giáo viên, phòng..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Giáo viên</label>
                  <select
                    value={filterTutor}
                    onChange={(e) => setFilterTutor(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">Tất cả giáo viên</option>
                    {availableTutors.map(tutor => (
                      <option key={tutor} value={tutor}>{tutor}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Xóa bộ lọc
                  </button>
                </div>
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
                        className={`px-4 py-2 rounded-md transition-colors ${selectedDate === date
                          ? 'bg-primary text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                          }`}
                      >
                        {formatDate(date)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Schedule Table */}
                {applyAdvancedFilters(filteredSchedules).length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md">
                      <thead className="bg-gray-100 dark:bg-gray-700">
                        <tr>
                          <th className="py-3 px-4 text-left text-gray-800 dark:text-gray-200">Lớp học</th>
                          <th className="py-3 px-4 text-left text-gray-800 dark:text-gray-200">Thời gian</th>
                          <th className="py-3 px-4 text-left text-gray-800 dark:text-gray-200">Giáo viên</th>
                        </tr>
                      </thead>
                      <tbody>
                        {applyAdvancedFilters(filteredSchedules).map(schedule => (
                          <tr key={schedule.id} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <td className="py-3 px-4 font-medium text-gray-800 dark:text-gray-200">{schedule.className}</td>
                            <td className="py-3 px-4 text-gray-800 dark:text-gray-200">
                              {schedule.startTime} - {schedule.endTime}
                            </td>
                            <td className="py-3 px-4 text-gray-800 dark:text-gray-200">{schedule.tutorName}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      {searchKeyword || filterTutor !== 'all'
                        ? 'Không tìm thấy lịch học phù hợp với bộ lọc.'
                        : 'Không có lịch học nào vào ngày đã chọn.'
                      }
                    </p>
                    {(searchKeyword || filterTutor !== 'all') && (
                      <button
                        onClick={clearFilters}
                        className="mt-4 text-primary hover:text-primary/80 dark:text-primary-400 dark:hover:text-primary-300"
                      >
                        Xóa bộ lọc
                      </button>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-gray-600 dark:text-gray-400">Chọn ngày trên lịch để xem chi tiết:</p>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => navigateMonth('prev')}
                        className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
                        aria-label="Tháng trước"
                      >
                        ←
                      </button>
                      <span className="font-medium text-gray-800 dark:text-gray-200 px-2">
                        {format(currentMonth, 'MM/yyyy')}
                      </span>
                      <button
                        onClick={() => navigateMonth('next')}
                        className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
                        aria-label="Tháng sau"
                      >
                        →
                      </button>
                    </div>
                  </div>
                  <div className="mb-4">
                    <button
                      onClick={() => setShowCalendarEvents(!showCalendarEvents)}
                      className={`px-4 py-2 rounded-md text-sm transition-colors ${showCalendarEvents
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                    >
                      {showCalendarEvents ? 'Ẩn số lượng lịch' : 'Hiện số lượng lịch'}
                    </button>
                  </div>
                  <div className="calendar-container">
                    <Calendar
                      onChange={value => handleCalendarChange(value as CalendarValue)}
                      value={calendarValue}
                      tileClassName={tileClassName}
                      tileContent={showCalendarEvents ? tileContent : undefined}
                      activeStartDate={currentMonth}
                      onActiveStartDateChange={({ activeStartDate }) => {
                        if (activeStartDate) setCurrentMonth(activeStartDate);
                      }}
                    />
                  </div>
                </div>

                {selectedDate && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-lg mb-4">
                      Lịch học ngày {formatDate(selectedDate)}
                    </h3>

                    {applyAdvancedFilters(filteredSchedules).length > 0 ? (
                      <div className="space-y-4">
                        {applyAdvancedFilters(filteredSchedules).map(schedule => (
                          <div key={schedule.id} className="border-l-4 border-primary pl-4 py-2">
                            <p className="font-medium text-gray-800 dark:text-gray-200">{schedule.className}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {schedule.startTime} - {schedule.endTime} | {schedule.tutorName}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-gray-500 dark:text-gray-400 italic">
                          {searchKeyword || filterTutor !== 'all'
                            ? 'Không tìm thấy lịch học phù hợp với bộ lọc.'
                            : 'Không có lịch học nào vào ngày đã chọn.'
                          }
                        </p>
                        {(searchKeyword || filterTutor !== 'all') && (
                          <button
                            onClick={clearFilters}
                            className="mt-2 text-primary hover:text-blue-700 underline"
                          >
                            Xóa bộ lọc
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <SectionHeading title="Lịch học cá nhân" centered={false} />

            {!showPersonalSchedules ? (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <p className="text-gray-700 dark:text-gray-200 mb-4">
                  Nhập số điện thoại của bạn để xem lịch học cá nhân.
                </p>

                <form onSubmit={handlePhoneSubmit}>
                  <div className="mb-4">
                    <label htmlFor="phone" className="block text-gray-700 dark:text-gray-200 font-medium mb-1">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={phone}
                      onChange={handlePhoneChange}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 ${phoneError ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                        }`}
                      placeholder="Nhập số điện thoại của bạn"
                    />
                    {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
                  </div>

                  <button type="submit" className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors" disabled={loading}>
                    {loading ? 'Đang tìm kiếm...' : 'Tìm kiếm'}
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">Lịch học của bạn</h3>
                  <button
                    onClick={resetPersonalSchedules}
                    className="text-sm text-primary hover:text-primary/80 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    Tìm kiếm khác
                  </button>
                </div>

                {personalSchedules.length > 0 ? (
                  <div className="space-y-4">
                    {personalSchedules.map(schedule => (
                      <div
                        key={schedule.id}
                        className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 p-4 rounded-lg"
                      >
                        <p className="font-medium text-gray-800 dark:text-gray-200">{schedule.className}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Ngày: {formatDate(schedule.startDate)}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Giờ: {schedule.startTime} - {schedule.endTime}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Giáo viên: {schedule.tutorName}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500 dark:text-gray-400">
                      Không tìm thấy lịch học nào cho số điện thoại này.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Nếu bạn đã đăng ký, vui lòng kiểm tra lại số điện thoại hoặc liên hệ với trung tâm.
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="mt-6 bg-gray-100 dark:bg-gray-900 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Thông tin liên hệ</h3>
              <p className="text-gray-700 dark:text-gray-200 text-sm mb-2">
                Nếu bạn gặp vấn đề khi xem lịch học, vui lòng liên hệ với chúng tôi:
              </p>
              <p className="text-gray-700 dark:text-gray-200 text-sm">Điện thoại: 0385.510.892 - 0962.390.161</p>
              <p className="text-gray-700 dark:text-gray-200 text-sm">Email: lienhe@giasuhoangha.com</p>
            </div>
          </div>
        </div>
      </div>
      <Chatbot />
    </Layout>
  );
};

export default SchedulePage;

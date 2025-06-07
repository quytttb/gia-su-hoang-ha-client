import { Link } from 'react-router-dom';
import Logo from '../shared/Logo';

interface FooterProps {
  isContactPage?: boolean;
}

const Footer = ({ isContactPage = false }: FooterProps) => {
  return (
    <footer className="bg-slate-100 dark:bg-gray-900 text-gray-800 dark:text-white py-10 border-t border-gray-200 dark:border-gray-700">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Logo variant="text" size="lg" linkTo="/" className="mb-4" />
            <p className="text-gray-600 dark:text-gray-300 mb-2">Trung tâm gia sư uy tín tại Thanh Hóa</p>
            <p className="text-gray-600 dark:text-gray-300">Mang đến kiến thức và kỹ năng cho thế hệ trẻ</p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Liên kết nhanh</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link to="/classes" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                  Khóa học
                </Link>
              </li>
              <li>
                <Link to="/tutor-search" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                  Tìm gia sư
                </Link>
              </li>
              <li>
                <Link to="/schedule" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                  Lịch học
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Liên hệ</h4>
            <address className="not-italic text-gray-600 dark:text-gray-300">
              <p className="mb-2">
                265 - ĐƯỜNG 06 - MẶT BẰNG 08, PHƯỜNG NAM NGẠN, THÀNH PHỐ THANH HOÁ, TỈNH THANH HOÁ
              </p>
              <p className="mb-2">Điện thoại: 0385.510.892 - 0962.390.161</p>
              <p className="mb-2">Email: giasuhoangha.tpth@gmail.com</p>
            </address>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Giờ làm việc</h4>
            <ul className="text-gray-600 dark:text-gray-300">
              <li className="mb-2">Thứ 2 - Thứ 6: 7:30 - 20:00</li>
              <li className="mb-2">Thứ 7 - Chủ nhật: 8:00 - 17:00</li>
            </ul>
            {!isContactPage && (
              <div className="mt-4 rounded overflow-hidden shadow">
                <iframe
                  title="Google Maps - Gia Sư Hoàng Hà"
                  src="https://www.google.com/maps?q=265%20%C4%90%C6%B0%E1%BB%9Dng%2006%2C%20M%E1%BA%B7t%20B%E1%BA%B1ng%2008%2C%20Ph%C6%B0%E1%BB%9Dng%20Nam%20Ng%E1%BA%A1n%2C%20Th%C3%A0nh%20Ph%E1%BB%91%20Thanh%20Ho%C3%A1%2C%20T%E1%BB%89nh%20Thanh%20Ho%C3%A1&output=embed"
                  width="100%"
                  height="150"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-300 dark:border-gray-700 mt-8 pt-6 text-center text-gray-500 dark:text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Trung tâm Gia Sư Hoàng Hà. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

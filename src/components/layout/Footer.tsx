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
              <p className="mb-2">
                Facebook: <a
                  href="https://www.facebook.com/profile.php?id=61575087818708"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Gia Sư Hoàng Hà - TP Thanh Hoá
                </a>
              </p>
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
                  title="Facebook Page - Gia Sư Hoàng Hà"
                  src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fprofile.php%3Fid%3D61575087818708&tabs=timeline&width=340&height=150&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
                  width="100%"
                  height="150"
                  style={{ border: 0 }}
                  scrolling="no"
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
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

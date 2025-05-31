import { Link } from 'react-router-dom';
import { Course } from '../../types';
import { calculateDiscountedPrice, formatCurrency, isDiscountValid } from '../../utils/helpers';
import LazyImage from './LazyImage';
import { trackCourseView, trackUserEngagement } from '../../utils/analytics';
import { trackCourseViewEcommerce, trackAddToCart } from '../../utils/ecommerce';

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  const {
    id,
    name,
    description,
    targetAudience,
    schedule,
    price,
    discount,
    discountEndDate,
    imageUrl,
  } = course;

  const hasValidDiscount = discount && isDiscountValid(discountEndDate);
  const finalPrice = hasValidDiscount ? calculateDiscountedPrice(price, discount) : price;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg overflow-hidden transition-all duration-200 hover:scale-[1.02] hover:shadow-lg dark:hover:shadow-xl border border-gray-200 dark:border-gray-700">
      <div className="h-48 overflow-hidden">
        <LazyImage src={imageUrl} alt={name} className="w-full h-full" />
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2 line-clamp-2">{name}</h3>

        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-3">{description}</p>

        <div className="mb-3">
          <span className="text-gray-700 dark:text-gray-300 text-sm block mb-1">
            <strong>Đối tượng:</strong> {targetAudience}
          </span>
          <span className="text-gray-700 dark:text-gray-300 text-sm block">
            <strong>Lịch học:</strong> {schedule}
          </span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            {hasValidDiscount ? (
              <div className="flex flex-col">
                <span className="text-gray-500 dark:text-gray-400 line-through text-sm">{formatCurrency(price)}</span>
                <span className="text-primary dark:text-blue-400 font-bold">{formatCurrency(finalPrice)}</span>
              </div>
            ) : (
              <span className="text-primary dark:text-blue-400 font-bold">{formatCurrency(price)}</span>
            )}
          </div>

          {hasValidDiscount && (
            <div className="bg-primary text-white text-sm px-2 py-1 rounded-lg">
              Giảm {discount}%
            </div>
          )}
        </div>

        <div className="flex space-x-2">
          <Link
            to={`/courses/${id}`}
            className="btn-primary flex-1 text-center"
            onClick={() => {
              trackCourseView(id.toString(), name);
              trackCourseViewEcommerce({
                id: id.toString(),
                name,
                price: finalPrice,
                category: targetAudience,
              });
              trackUserEngagement('click', 'course_detail_button');
            }}
          >
            Xem chi tiết
          </Link>

          <Link
            to={`/courses/${id}/register`}
            className="btn-outline-primary text-center px-4 py-2 rounded-lg"
            onClick={() => {
              trackAddToCart({
                id: id.toString(),
                name,
                price: finalPrice,
                category: targetAudience,
              });
              trackUserEngagement('click', 'course_register_button');
            }}
          >
            Đăng ký
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;

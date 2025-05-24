import { Link } from 'react-router-dom';
import { Course } from '../../types';
import { calculateDiscountedPrice, formatCurrency, isDiscountValid } from '../../utils/helpers';

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
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-lg">
      <div className="h-48 overflow-hidden">
        <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{name}</h3>

        <p className="text-gray-600 text-sm mb-3 line-clamp-3">{description}</p>

        <div className="mb-3">
          <span className="text-gray-700 text-sm block mb-1">
            <strong>Đối tượng:</strong> {targetAudience}
          </span>
          <span className="text-gray-700 text-sm block">
            <strong>Lịch học:</strong> {schedule}
          </span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            {hasValidDiscount ? (
              <div className="flex flex-col">
                <span className="text-gray-500 line-through text-sm">{formatCurrency(price)}</span>
                <span className="text-primary font-bold">{formatCurrency(finalPrice)}</span>
              </div>
            ) : (
              <span className="text-primary font-bold">{formatCurrency(price)}</span>
            )}
          </div>

          {hasValidDiscount && (
            <div className="bg-primary text-white text-sm px-2 py-1 rounded-lg">
              Giảm {discount}%
            </div>
          )}
        </div>

        <div className="flex space-x-2">
          <Link to={`/courses/${id}`} className="btn-primary flex-1 text-center">
            Xem chi tiết
          </Link>

          <Link
            to={`/courses/${id}/register`}
            className="border border-primary text-primary hover:bg-primary hover:text-white transition-colors px-4 py-2 rounded text-center"
          >
            Đăng ký
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;

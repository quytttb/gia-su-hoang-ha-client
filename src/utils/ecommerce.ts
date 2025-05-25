// Enhanced Ecommerce Events for GA4

// Enhanced Ecommerce Events for GA4
export interface CourseItem {
     item_id: string;
     item_name: string;
     item_category: string;
     item_variant?: string;
     price: number;
     quantity: number;
}

export interface PurchaseData {
     transaction_id: string;
     value: number;
     currency: string;
     items: CourseItem[];
     coupon?: string;
}

// Track course view (Enhanced Ecommerce)
export const trackCourseViewEcommerce = (course: {
     id: string;
     name: string;
     price: number;
     category?: string;
}) => {
     if (!window.gtag) return;

     window.gtag('event', 'view_item', {
          currency: 'VND',
          value: course.price,
          items: [
               {
                    item_id: course.id,
                    item_name: course.name,
                    item_category: course.category || 'Khóa học',
                    price: course.price,
                    quantity: 1,
               },
          ],
     });
};

// Track add to cart (when user clicks register)
export const trackAddToCart = (course: {
     id: string;
     name: string;
     price: number;
     category?: string;
}) => {
     if (!window.gtag) return;

     window.gtag('event', 'add_to_cart', {
          currency: 'VND',
          value: course.price,
          items: [
               {
                    item_id: course.id,
                    item_name: course.name,
                    item_category: course.category || 'Khóa học',
                    price: course.price,
                    quantity: 1,
               },
          ],
     });
};

// Track course registration start
export const trackBeginCheckout = (course: {
     id: string;
     name: string;
     price: number;
     category?: string;
}) => {
     if (!window.gtag) return;

     window.gtag('event', 'begin_checkout', {
          currency: 'VND',
          value: course.price,
          items: [
               {
                    item_id: course.id,
                    item_name: course.name,
                    item_category: course.category || 'Khóa học',
                    price: course.price,
                    quantity: 1,
               },
          ],
     });
};

// Track successful course registration
export const trackPurchase = (purchaseData: PurchaseData) => {
     if (!window.gtag) return;

     window.gtag('event', 'purchase', {
          transaction_id: purchaseData.transaction_id,
          value: purchaseData.value,
          currency: purchaseData.currency,
          items: purchaseData.items,
          coupon: purchaseData.coupon,
     });
};

// Track course search
export const trackSearch = (searchTerm: string, results?: number) => {
     if (!window.gtag) return;

     window.gtag('event', 'search', {
          search_term: searchTerm,
          results: results,
     });
};

// Track course list view
export const trackViewItemList = (listName: string, courses: CourseItem[]) => {
     if (!window.gtag) return;

     window.gtag('event', 'view_item_list', {
          item_list_name: listName,
          items: courses,
     });
};

// Track course promotion view
export const trackViewPromotion = (promotionId: string, promotionName: string) => {
     if (!window.gtag) return;

     window.gtag('event', 'view_promotion', {
          promotion_id: promotionId,
          promotion_name: promotionName,
     });
};

// Track course share
export const trackShare = (courseId: string, method: string) => {
     if (!window.gtag) return;

     window.gtag('event', 'share', {
          method: method,
          content_type: 'course',
          content_id: courseId,
     });
}; 
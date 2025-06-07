import React from 'react';
import { Link } from 'react-router-dom';
import BlogCard from '../blog/BlogCard';
import { Button } from '../ui/button';
import { ArrowRight, BookOpen, TrendingUp } from 'lucide-react';
import { getLatestPosts, getFeaturedPosts } from '../../data/blogData';

const BlogSection: React.FC = () => {
     const latestPosts = getLatestPosts(4);
     const featuredPosts = getFeaturedPosts().slice(0, 2);

     return (
          <section className="section-padding bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
               <div className="container-custom">
                    {/* Section Header */}
                    <div className="text-center mb-12">
                         <div className="flex items-center justify-center gap-3 mb-4">
                              <BookOpen className="w-8 h-8 text-primary" />
                              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                                   Blog Giáo Dục
                              </h2>
                         </div>
                         <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                              Chia sẻ kiến thức, kinh nghiệm học tập và những tin tức mới nhất về giáo dục
                         </p>
                    </div>

                    {/* Featured Posts */}
                    {featuredPosts.length > 0 && (
                         <div className="mb-16">
                              <div className="flex items-center gap-4 mb-8">
                                   <div className="flex items-center gap-2">
                                        <TrendingUp className="w-6 h-6 text-primary" />
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                             Bài viết nổi bật
                                        </h3>
                                   </div>
                                   <div className="flex-1 h-px bg-gradient-to-r from-primary to-transparent"></div>
                              </div>

                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                                   {featuredPosts.map((post) => (
                                        <BlogCard key={post.id} post={post} variant="featured" />
                                   ))}
                              </div>
                         </div>
                    )}

                    {/* Latest Posts */}
                    <div className="mb-12">
                         <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                              Bài viết mới nhất
                         </h3>

                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                              {latestPosts.map((post) => (
                                   <BlogCard key={post.id} post={post} />
                              ))}
                         </div>
                    </div>

                    {/* Call to Action */}
                    <div className="text-center">
                         <Button size="lg" asChild className="rounded-full px-8">
                              <Link to="/blog">
                                   Xem tất cả bài viết
                                   <ArrowRight className="ml-2 w-5 h-5" />
                              </Link>
                         </Button>
                    </div>

                    {/* Statistics */}
                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                         <div className="text-center p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
                              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                   <BookOpen className="w-8 h-8 text-primary" />
                              </div>
                              <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                   {latestPosts.length}+
                              </h4>
                              <p className="text-gray-600 dark:text-gray-300">
                                   Bài viết chia sẻ kiến thức
                              </p>
                         </div>

                         <div className="text-center p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
                              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                   <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
                              </div>
                              <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                   5
                              </h4>
                              <p className="text-gray-600 dark:text-gray-300">
                                   Chủ đề đa dạng
                              </p>
                         </div>

                         <div className="text-center p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
                              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                   <ArrowRight className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                              </div>
                              <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                   Hàng tuần
                              </h4>
                              <p className="text-gray-600 dark:text-gray-300">
                                   Cập nhật nội dung mới
                              </p>
                         </div>
                    </div>
               </div>
          </section>
     );
};

export default BlogSection; 
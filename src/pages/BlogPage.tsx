import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import BlogCard from '../components/blog/BlogCard';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { Search, Filter, Calendar, TrendingUp, BookOpen } from 'lucide-react';
import { blogCategories } from '../constants/blogData';
import { BlogCategory } from '../types';
import SkeletonLoading from '../components/shared/SkeletonLoading';
import { BlogService } from '../services/blogService';

const BlogPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'readTime'>('latest');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [latestPosts, setLatestPosts] = useState<any[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<any[]>([]);
  const [cursor, setCursor] = useState<any | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Future: pagination states if needed
  const location = useLocation();

  // Function to scroll to section
  const scrollToSection = (sectionId: string) => {
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest',
        });
      }
    }, 100);
  };

  // Handle scroll to section when page loads with hash
  useEffect(() => {
    if (location.hash && !loading) {
      const sectionId = location.hash.replace('#', '');
      scrollToSection(sectionId);
    }
  }, [location.hash, loading]);

  const loadInitial = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await BlogService.listPosts({ pageSize: 12 });
      setPosts(res.posts);
      setCursor(res.cursor);
      setHasMore(!!res.cursor);
      setFeaturedPosts(res.posts.filter(p => p.featured).slice(0, 4));
      setLatestPosts(
        res.posts
          .filter(p => p.status === 'published')
          .sort((a, b) => {
            const bp: any = b.publishedAt;
            const ap: any = a.publishedAt;
            const bTime =
              typeof bp === 'string' ? Date.parse(bp) : bp?.seconds ? bp.seconds * 1000 : 0;
            const aTime =
              typeof ap === 'string' ? Date.parse(ap) : ap?.seconds ? ap.seconds * 1000 : 0;
            return bTime - aTime;
          })
          .slice(0, 3)
      );
    } catch (e: any) {
      setError(e.message || 'Không thể tải bài viết.');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = async () => {
    if (!cursor) return;
    setLoadingMore(true);
    setError(null);
    try {
      const res = await BlogService.listPosts({ pageSize: 12, cursor });
      setPosts(prev => [...prev, ...res.posts]);
      setCursor(res.cursor);
      setHasMore(!!res.cursor);
    } catch (e: any) {
      setError(e.message || 'Không thể tải thêm bài viết.');
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    loadInitial();
  }, [loadInitial]);

  // Filter and sort posts
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = posts.filter(post => {
      if (post.status !== 'published') return false;

      const matchesSearch =
        searchTerm === '' ||
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.tags || []).some((tag: string) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesCategory =
        selectedCategory === 'all' ||
        post.categoryId === selectedCategory ||
        post.category?.id === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    // Sort posts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popular': {
          return (b.viewCount || 0) - (a.viewCount || 0);
        }
        case 'readTime': {
          return a.readTime - b.readTime;
        }
        case 'latest':
        default: {
          const bTime = b.publishedAt?.seconds
            ? b.publishedAt.seconds * 1000
            : Date.parse(b.publishedAt || '0');
          const aTime = a.publishedAt?.seconds
            ? a.publishedAt.seconds * 1000
            : Date.parse(a.publishedAt || '0');
          return bTime - aTime;
        }
      }
    });

    return filtered;
  }, [searchTerm, selectedCategory, sortBy, posts]);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        {/* Hero Section */}
        <section
          className="relative bg-[#e3f0ff] dark:bg-gradient-to-b dark:from-[#182848] dark:to-[#35577d] text-blue-900 dark:text-white py-16 overflow-hidden shadow-md border-b border-blue-200 dark:border-blue-900"
          aria-labelledby="blog-hero-heading"
        >
          {/* Logo background mờ */}
          <img
            src="/images/logo.png"
            alt="Logo Gia Sư Hoàng Hà"
            className="absolute inset-0 m-auto w-[340px] h-[340px] opacity-20 dark:opacity-25 pointer-events-none select-none z-0"
            style={{ left: '0', right: '0', top: '0', bottom: '0', filter: 'brightness(1.15)' }}
          />
          {/* Overlay phù hợp với cả 2 mode */}
          <div className="absolute inset-0 bg-white/70 dark:bg-white/10 z-10"></div>
          <div className="container-custom relative z-20">
            <div className="max-w-4xl mx-auto text-center">
              <h1
                id="blog-hero-heading"
                className="text-4xl md:text-5xl font-bold mb-4 text-primary-700 dark:text-primary-500 drop-shadow-md"
              >
                Blog Gia Sư Hoàng Hà
              </h1>
              <p className="text-xl md:text-2xl font-semibold text-accent-600 dark:text-accent-500 mb-8">
                Chia sẻ kiến thức, kinh nghiệm và tin tức giáo dục
              </p>
              <div className="flex flex-wrap items-center justify-center gap-6 text-blue-700 dark:text-blue-200">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  <span>{posts.filter(p => p.status === 'published').length} bài viết</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>{blogCategories.length} chủ đề</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>Cập nhật hàng tuần</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container-custom py-12">
          {/* Featured Posts Section */}
          {loading ? (
            <section id="featured-posts" className="mb-16" aria-labelledby="featured-posts-heading">
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-2">
                  <SkeletonLoading type="text" count={1} width="200px" />
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-primary to-transparent"></div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <SkeletonLoading type="card" count={2} height="300px" />
              </div>
            </section>
          ) : (
            featuredPosts.length > 0 && (
              <section
                id="featured-posts"
                className="mb-16"
                aria-labelledby="featured-posts-heading"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-primary" />
                    <h2 id="featured-posts-heading" className="text-3xl font-bold">
                      Bài viết nổi bật
                    </h2>
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-primary to-transparent"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {featuredPosts.map(post => (
                    <BlogCard
                      key={post.id}
                      post={{
                        ...post,
                        category:
                          post.category || blogCategories.find(c => c.id === post.categoryId),
                      }}
                      variant="featured"
                    />
                  ))}
                </div>
              </section>
            )
          )}

          {/* Categories Section */}
          {loading ? (
            <section id="categories" className="mb-12" aria-labelledby="categories-heading">
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <SkeletonLoading type="text" count={1} width="100px" />
                <div className="flex gap-2">
                  {[...Array(6)].map((_, i) => (
                    <SkeletonLoading key={i} type="button" width="80px" />
                  ))}
                </div>
              </div>
            </section>
          ) : (
            <section id="categories" className="mb-12" aria-labelledby="categories-heading">
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <h3
                  id="categories-heading"
                  className="text-xl font-semibold flex items-center gap-2"
                >
                  <Filter className="w-5 h-5 text-primary" />
                  Chủ đề
                </h3>
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleCategoryClick('all')}
                  className="rounded-full"
                >
                  Tất cả
                </Button>
                {blogCategories.map((category: BlogCategory) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleCategoryClick(category.id)}
                    className="rounded-full"
                    style={{
                      backgroundColor:
                        selectedCategory === category.id ? category.color : undefined,
                      borderColor: category.color,
                      color: selectedCategory === category.id ? 'white' : category.color,
                    }}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </section>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div id="main-content" className="lg:col-span-3">
              {/* Search and Filter */}
              <div id="search-filter">
                {loading ? (
                  <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                      <SkeletonLoading type="text" count={1} />
                    </div>
                    <SkeletonLoading type="button" width="150px" />
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Tìm kiếm bài viết..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                      <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="Sắp xếp theo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="latest">Mới nhất</SelectItem>
                        <SelectItem value="popular">Phổ biến</SelectItem>
                        <SelectItem value="readTime">Thời gian đọc</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* Error State */}
              {error && !loading && (
                <Card className="mb-6 border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20">
                  <CardContent className="py-6">
                    <h3 className="text-red-600 dark:text-red-400 font-semibold mb-2">
                      Lỗi tải dữ liệu
                    </h3>
                    <p className="text-sm text-red-700 dark:text-red-300 mb-4">{error}</p>
                    <Button variant="outline" size="sm" onClick={loadInitial}>
                      Thử lại
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Posts Grid */}
              <div id="posts-grid">
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SkeletonLoading type="card" count={6} />
                  </div>
                ) : filteredAndSortedPosts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredAndSortedPosts.map(post => (
                      <BlogCard key={post.id} post={post} />
                    ))}
                  </div>
                ) : (
                  <Card className="text-center py-12">
                    <CardContent>
                      <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Không tìm thấy bài viết</h3>
                      <p className="text-muted-foreground">
                        Hãy thử thay đổi từ khóa tìm kiếm hoặc chọn chủ đề khác.
                      </p>
                    </CardContent>
                  </Card>
                )}
                {/* Load More */}
                {!loading &&
                  !searchTerm &&
                  selectedCategory === 'all' &&
                  filteredAndSortedPosts.length > 0 &&
                  hasMore && (
                    <div className="flex justify-center mt-10">
                      <Button
                        onClick={loadMore}
                        disabled={loadingMore}
                        variant="outline"
                        className="min-w-[200px]"
                      >
                        {loadingMore ? 'Đang tải...' : 'Xem thêm'}
                      </Button>
                    </div>
                  )}
              </div>
            </div>

            {/* Sidebar */}
            <div id="sidebar" className="lg:col-span-1">
              <div className="sticky top-6 space-y-6">
                {/* Latest Posts */}
                <Card id="latest-posts">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Calendar className="w-5 h-5 text-primary" />
                      Bài viết mới nhất
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0">
                    {latestPosts.map((post, index) => (
                      <div key={post.id}>
                        <BlogCard post={post} variant="compact" />
                        {index < latestPosts.length - 1 && <Separator className="mt-3" />}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Categories */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Filter className="w-5 h-5 text-primary" />
                      Chủ đề
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {blogCategories.map(category => {
                        const postsCount = posts.filter(
                          post =>
                            (post.categoryId === category.id ||
                              post.category?.id === category.id) &&
                            post.status === 'published'
                        ).length;

                        return (
                          <button
                            key={category.id}
                            onClick={() => handleCategoryClick(category.id)}
                            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors text-left"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: category.color }}
                              ></div>
                              <span className="font-medium">{category.name}</span>
                            </div>
                            <Badge variant="secondary">{postsCount}</Badge>
                          </button>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Popular Tags */}
                <Card>
                  <CardHeader>
                    <CardTitle>Tags phổ biến</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(new Set(posts.flatMap(post => post.tags || [])))
                        .slice(0, 15)
                        .map(tag => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                            onClick={() => setSearchTerm(tag)}
                          >
                            {tag}
                          </Badge>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BlogPage;

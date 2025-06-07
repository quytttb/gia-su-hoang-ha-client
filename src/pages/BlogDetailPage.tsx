import React, { useMemo, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import BlogCard from '../components/blog/BlogCard';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import {
     ArrowLeft,
     Calendar,
     Clock,
     Eye,
     User,
     Share2,
     Facebook,
     Twitter,
     Linkedin,
     Copy,
     BookOpen
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { getPostById, getRelatedPosts, getLatestPosts } from '../data/blogData';

const BlogDetailPage: React.FC = () => {
     const { id } = useParams<{ id: string }>();

     const post = useMemo(() => {
          return id ? getPostById(id) : null;
     }, [id]);

     const relatedPosts = useMemo(() => {
          return id ? getRelatedPosts(id, 3) : [];
     }, [id]);

     const latestPosts = useMemo(() => {
          return getLatestPosts(4).filter(p => p.id !== id);
     }, [id]);

     // Scroll to top when component mounts or ID changes
     useEffect(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
     }, [id]);

     if (!post) {
          return <Navigate to="/blog" replace />;
     }

     const formatDate = (dateString: string) => {
          return format(new Date(dateString), 'dd MMMM yyyy', { locale: vi });
     };

     const handleShare = (platform: string) => {
          const url = window.location.href;
          const title = post.title;

          let shareUrl = '';
          switch (platform) {
               case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                    break;
               case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
                    break;
               case 'linkedin':
                    shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
                    break;
               case 'copy':
                    navigator.clipboard.writeText(url);
                    return;
          }

          if (shareUrl) {
               window.open(shareUrl, '_blank', 'width=600,height=400');
          }
     };

     return (
          <Layout>
               <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
                    {/* Hero Image */}
                    <div className="relative h-[60vh] overflow-hidden">
                         <img
                              src={post.imageUrl}
                              alt={post.title}
                              className="w-full h-full object-cover"
                         />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                         {/* Back Button */}
                         <div className="absolute top-6 left-6">
                              <Button variant="secondary" size="sm" asChild className="backdrop-blur-sm bg-white/10 hover:bg-white/20 text-white border-white/30">
                                   <Link to="/blog">
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        Quay lại Blog
                                   </Link>
                              </Button>
                         </div>

                         {/* Article Meta */}
                         <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                              <div className="container-custom">
                                   <div className="max-w-4xl">
                                        <Badge
                                             className="mb-4 font-medium"
                                             style={{ backgroundColor: post.category.color, color: 'white' }}
                                        >
                                             {post.category.name}
                                        </Badge>

                                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                                             {post.title}
                                        </h1>

                                        {post.subtitle && (
                                             <p className="text-lg md:text-xl text-gray-200 mb-6 leading-relaxed">
                                                  {post.subtitle}
                                             </p>
                                        )}

                                        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300">
                                             <div className="flex items-center gap-2">
                                                  <User className="w-4 h-4" />
                                                  <span>{post.author}</span>
                                             </div>
                                             <div className="flex items-center gap-2">
                                                  <Calendar className="w-4 h-4" />
                                                  <span>{formatDate(post.publishedAt)}</span>
                                             </div>
                                             <div className="flex items-center gap-2">
                                                  <Clock className="w-4 h-4" />
                                                  <span>{post.readTime} phút đọc</span>
                                             </div>
                                             {post.viewCount && (
                                                  <div className="flex items-center gap-2">
                                                       <Eye className="w-4 h-4" />
                                                       <span>{post.viewCount.toLocaleString()} lượt xem</span>
                                                  </div>
                                             )}
                                        </div>
                                   </div>
                              </div>
                         </div>
                    </div>

                    <div className="container-custom py-12">
                         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                              {/* Main Content */}
                              <div className="lg:col-span-3">
                                   <Card className="mb-8">
                                        <CardContent className="p-8">
                                             {/* Article Content */}
                                             <div
                                                  className="prose prose-lg max-w-none dark:prose-invert
                      prose-headings:text-gray-900 dark:prose-headings:text-gray-100
                      prose-p:text-gray-700 dark:prose-p:text-gray-300
                      prose-p:leading-relaxed
                      prose-strong:text-gray-900 dark:prose-strong:text-gray-100
                      prose-a:text-primary hover:prose-a:text-primary-600"
                                                  dangerouslySetInnerHTML={{ __html: post.content }}
                                             />

                                             {/* Tags */}
                                             <div className="mt-8 pt-6 border-t">
                                                  <h4 className="text-sm font-medium text-muted-foreground mb-3">Tags:</h4>
                                                  <div className="flex flex-wrap gap-2">
                                                       {post.tags.map((tag) => (
                                                            <Link
                                                                 key={tag}
                                                                 to={`/blog?search=${encodeURIComponent(tag)}`}
                                                            >
                                                                 <Badge variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-colors">
                                                                      {tag}
                                                                 </Badge>
                                                            </Link>
                                                       ))}
                                                  </div>
                                             </div>

                                             {/* Share Buttons */}
                                             <div className="mt-6 pt-6 border-t">
                                                  <h4 className="text-sm font-medium text-muted-foreground mb-3">Chia sẻ bài viết:</h4>
                                                  <div className="flex gap-3">
                                                       <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleShare('facebook')}
                                                            className="flex items-center gap-2"
                                                       >
                                                            <Facebook className="w-4 h-4" />
                                                            Facebook
                                                       </Button>
                                                       <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleShare('twitter')}
                                                            className="flex items-center gap-2"
                                                       >
                                                            <Twitter className="w-4 h-4" />
                                                            Twitter
                                                       </Button>
                                                       <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleShare('linkedin')}
                                                            className="flex items-center gap-2"
                                                       >
                                                            <Linkedin className="w-4 h-4" />
                                                            LinkedIn
                                                       </Button>
                                                       <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleShare('copy')}
                                                            className="flex items-center gap-2"
                                                       >
                                                            <Copy className="w-4 h-4" />
                                                            Copy
                                                       </Button>
                                                  </div>
                                             </div>
                                        </CardContent>
                                   </Card>

                                   {/* Related Posts */}
                                   {relatedPosts.length > 0 && (
                                        <section>
                                             <div className="flex items-center gap-4 mb-6">
                                                  <div className="flex items-center gap-2">
                                                       <BookOpen className="w-6 h-6 text-primary" />
                                                       <h2 className="text-2xl font-bold">Bài viết liên quan</h2>
                                                  </div>
                                                  <div className="flex-1 h-px bg-gradient-to-r from-primary to-transparent"></div>
                                             </div>

                                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                  {relatedPosts.map((relatedPost) => (
                                                       <BlogCard key={relatedPost.id} post={relatedPost} />
                                                  ))}
                                             </div>
                                        </section>
                                   )}
                              </div>

                              {/* Sidebar */}
                              <div className="lg:col-span-1">
                                   <div className="sticky top-6 space-y-6">
                                        {/* Author Info */}
                                        <Card>
                                             <CardHeader>
                                                  <CardTitle>Tác giả</CardTitle>
                                             </CardHeader>
                                             <CardContent>
                                                  <div className="flex items-center gap-3">
                                                       <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-semibold">
                                                            {post.author[0]}
                                                       </div>
                                                       <div>
                                                            <h4 className="font-semibold">{post.author}</h4>
                                                            <p className="text-sm text-muted-foreground">Giáo viên</p>
                                                       </div>
                                                  </div>
                                             </CardContent>
                                        </Card>

                                        {/* Share Widget */}
                                        <Card>
                                             <CardHeader>
                                                  <CardTitle className="flex items-center gap-2">
                                                       <Share2 className="w-5 h-5 text-primary" />
                                                       Chia sẻ
                                                  </CardTitle>
                                             </CardHeader>
                                             <CardContent>
                                                  <div className="grid grid-cols-2 gap-2">
                                                       <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleShare('facebook')}
                                                            className="w-full"
                                                       >
                                                            <Facebook className="w-4 h-4" />
                                                       </Button>
                                                       <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleShare('twitter')}
                                                            className="w-full"
                                                       >
                                                            <Twitter className="w-4 h-4" />
                                                       </Button>
                                                       <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleShare('linkedin')}
                                                            className="w-full"
                                                       >
                                                            <Linkedin className="w-4 h-4" />
                                                       </Button>
                                                       <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleShare('copy')}
                                                            className="w-full"
                                                       >
                                                            <Copy className="w-4 h-4" />
                                                       </Button>
                                                  </div>
                                             </CardContent>
                                        </Card>

                                        {/* Latest Posts */}
                                        <Card>
                                             <CardHeader className="pb-4">
                                                  <CardTitle className="flex items-center gap-2 text-lg">
                                                       <Calendar className="w-5 h-5 text-primary" />
                                                       Bài viết khác
                                                  </CardTitle>
                                             </CardHeader>
                                             <CardContent className="space-y-3 pt-0">
                                                  {latestPosts.slice(0, 3).map((latestPost, index) => (
                                                       <div key={latestPost.id}>
                                                            <BlogCard post={latestPost} variant="compact" />
                                                            {index < latestPosts.slice(0, 3).length - 1 && (
                                                                 <Separator className="mt-3" />
                                                            )}
                                                       </div>
                                                  ))}
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

export default BlogDetailPage; 
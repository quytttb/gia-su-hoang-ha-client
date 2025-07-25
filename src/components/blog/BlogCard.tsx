import React from 'react';
import { Link } from 'react-router-dom';
import { BlogPost } from '../../types';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Badge } from '../ui/badge';
import { Clock, Eye, User, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface BlogCardProps {
     post: BlogPost;
     variant?: 'default' | 'featured' | 'compact';
     className?: string;
}

const BlogCard: React.FC<BlogCardProps> = ({
     post,
     variant = 'default',
     className = ''
}) => {
     const formatDate = (dateString: string) => {
          if (variant === 'compact') {
               return format(new Date(dateString), 'dd/MM', { locale: vi });
          }
          return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi });
     };

     const baseCardClasses = "group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden";

     if (variant === 'featured') {
          return (
               <Link to={`/blog/${post.id}`} className={className}>
                    <Card className={`${baseCardClasses} h-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-2 border-primary/20 hover:border-primary/40`}>
                         <div className="aspect-video relative overflow-hidden">
                              <img
                                   src={post.imageUrl}
                                   alt={post.title}
                                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute top-4 left-4">
                                   <Badge
                                        className="bg-primary text-primary-foreground font-medium"
                                        style={{ backgroundColor: post.category.color }}
                                   >
                                        {post.category.name}
                                   </Badge>
                              </div>
                              {post.featured && (
                                   <div className="absolute top-4 right-4">
                                        <Badge variant="destructive" className="font-medium">
                                             Nổi bật
                                        </Badge>
                                   </div>
                              )}
                         </div>

                         <CardHeader className="pb-3">
                              <h2 className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors">
                                   {post.title}
                              </h2>
                              {post.subtitle && (
                                   <p className="text-sm text-muted-foreground line-clamp-1">
                                        {post.subtitle}
                                   </p>
                              )}
                         </CardHeader>

                         <CardContent className="pt-0">
                              <p className="text-muted-foreground line-clamp-3 mb-4">
                                   {post.excerpt}
                              </p>

                              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                                   <div className="flex items-center gap-1">
                                        <User className="w-4 h-4" />
                                        <span>{post.author}</span>
                                   </div>
                                   <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        <span>{formatDate(post.publishedAt)}</span>
                                   </div>
                                   <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        <span>{post.readTime} phút</span>
                                   </div>
                                   {post.viewCount && (
                                        <div className="flex items-center gap-1">
                                             <Eye className="w-4 h-4" />
                                             <span>{post.viewCount.toLocaleString()}</span>
                                        </div>
                                   )}
                              </div>

                              <div className="flex flex-wrap gap-2 mt-3">
                                   {post.tags.slice(0, 3).map((tag) => (
                                        <Badge key={tag} variant="secondary" className="text-xs">
                                             {tag}
                                        </Badge>
                                   ))}
                                   {post.tags.length > 3 && (
                                        <Badge variant="outline" className="text-xs">
                                             +{post.tags.length - 3}
                                        </Badge>
                                   )}
                              </div>
                         </CardContent>
                    </Card>
               </Link>
          );
     }

     if (variant === 'compact') {
          return (
               <Link to={`/blog/${post.id}`} className={className}>
                    <Card className={`${baseCardClasses} h-full`}>
                         <div className="flex gap-3 p-3">
                              <div className="flex-shrink-0 w-20 h-14 rounded-md overflow-hidden">
                                   <img
                                        src={post.imageUrl}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                   />
                              </div>

                              <div className="flex-1 min-w-0">
                                   <div className="mb-1">
                                        <h3 className="font-semibold line-clamp-2 text-sm group-hover:text-primary transition-colors leading-tight">
                                             {post.title}
                                        </h3>
                                   </div>

                                   <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                                        <span className="truncate">{formatDate(post.publishedAt)}</span>
                                        <span>•</span>
                                        <span className="whitespace-nowrap">{post.readTime} phút</span>
                                   </div>

                                   <div className="flex justify-end">
                                        <Badge
                                             className="text-xs px-2 py-1"
                                             style={{ backgroundColor: post.category.color, color: 'white' }}
                                        >
                                             {post.category.name}
                                        </Badge>
                                   </div>
                              </div>
                         </div>
                    </Card>
               </Link>
          );
     }

     // Default variant
     return (
          <Link to={`/blog/${post.id}`} className={className}>
               <Card className={`${baseCardClasses} h-full`}>
                    <div className="aspect-video relative overflow-hidden">
                         <img
                              src={post.imageUrl}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                         />
                         <div className="absolute top-4 left-4">
                              <Badge
                                   className="font-medium"
                                   style={{ backgroundColor: post.category.color, color: 'white' }}
                              >
                                   {post.category.name}
                              </Badge>
                         </div>
                         {post.featured && (
                              <div className="absolute top-4 right-4">
                                   <Badge variant="destructive" className="font-medium">
                                        Nổi bật
                                   </Badge>
                              </div>
                         )}
                    </div>

                    <CardHeader className="pb-3">
                         <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                              {post.title}
                         </h3>
                         {post.subtitle && (
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                   {post.subtitle}
                              </p>
                         )}
                    </CardHeader>

                    <CardContent className="pt-0">
                         <p className="text-muted-foreground line-clamp-2 mb-4">
                              {post.excerpt}
                         </p>

                         <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                   <User className="w-4 h-4" />
                                   <span>{post.author}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                   <Calendar className="w-4 h-4" />
                                   <span>{formatDate(post.publishedAt)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                   <Clock className="w-4 h-4" />
                                   <span>{post.readTime} phút</span>
                              </div>
                              {post.viewCount && (
                                   <div className="flex items-center gap-1">
                                        <Eye className="w-4 h-4" />
                                        <span>{post.viewCount.toLocaleString()}</span>
                                   </div>
                              )}
                         </div>
                    </CardContent>
               </Card>
          </Link>
     );
};

export default BlogCard; 
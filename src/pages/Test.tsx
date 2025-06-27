import { useTheme } from '../contexts/ThemeContext';
import Logo from '../components/shared/Logo';
import UploadServiceStatus from '../components/panel/UploadServiceStatus';

const Test = () => {
     const { theme, resolvedTheme } = useTheme();

     return (
          <div className="min-h-screen bg-white dark:bg-gray-900 py-8">
               <div className="container-custom">
                    <div className="mb-8">
                         <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                              Logo & Dark Mode Test Page
                         </h1>
                         <p className="text-gray-600 dark:text-gray-400 mb-2">
                              Current theme: <span className="font-semibold">{theme}</span>
                         </p>
                         <p className="text-gray-600 dark:text-gray-400">
                              Resolved theme: <span className="font-semibold">{resolvedTheme}</span>
                         </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         {/* Logo Variants */}
                         <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Logo Variants</h2>

                              <div className="space-y-6">
                                   <div>
                                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Full Logo (Large)</h3>
                                        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded">
                                             <Logo variant="full" size="lg" linkTo="" />
                                        </div>
                                   </div>

                                   <div>
                                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Full Logo (Medium)</h3>
                                        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded">
                                             <Logo variant="full" size="md" linkTo="" />
                                        </div>
                                   </div>

                                   <div>
                                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Text Logo</h3>
                                        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded">
                                             <Logo variant="text" size="md" linkTo="" />
                                        </div>
                                   </div>

                                   <div>
                                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Icon Only</h3>
                                        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded">
                                             <Logo variant="icon" size="md" linkTo="" />
                                        </div>
                                   </div>
                              </div>
                         </div>

                         {/* Color Palette */}
                         <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Color Palette</h2>

                              <div className="space-y-4">
                                   <div>
                                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Primary (Blue)</h3>
                                        <div className="grid grid-cols-5 gap-2">
                                             <div className="bg-primary-500 h-12 rounded flex items-center justify-center text-white text-xs">500</div>
                                             <div className="bg-primary-600 h-12 rounded flex items-center justify-center text-white text-xs">600</div>
                                             <div className="bg-primary-700 h-12 rounded flex items-center justify-center text-white text-xs">700</div>
                                             <div className="bg-primary-800 h-12 rounded flex items-center justify-center text-white text-xs">800</div>
                                             <div className="bg-primary-900 h-12 rounded flex items-center justify-center text-white text-xs">900</div>
                                        </div>
                                   </div>

                                   <div>
                                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Accent (Yellow/Orange)</h3>
                                        <div className="grid grid-cols-5 gap-2">
                                             <div className="bg-accent-500 h-12 rounded flex items-center justify-center text-white text-xs">500</div>
                                             <div className="bg-accent-600 h-12 rounded flex items-center justify-center text-white text-xs">600</div>
                                             <div className="bg-accent-700 h-12 rounded flex items-center justify-center text-white text-xs">700</div>
                                             <div className="bg-accent-800 h-12 rounded flex items-center justify-center text-white text-xs">800</div>
                                             <div className="bg-accent-900 h-12 rounded flex items-center justify-center text-white text-xs">900</div>
                                        </div>
                                   </div>
                              </div>
                         </div>

                         {/* Button Showcase */}
                         <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Button Styles</h2>

                              <div className="space-y-4">
                                   <div className="flex flex-wrap gap-3">
                                        <button className="btn-primary">Primary Button</button>
                                        <button className="btn-accent">Accent Button</button>
                                   </div>

                                   <div className="flex flex-wrap gap-3">
                                        <button className="btn-outline-primary">Primary Outline</button>
                                        <button className="btn-outline-accent">Accent Outline</button>
                                   </div>
                              </div>
                         </div>

                         {/* Text Colors */}
                         <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Text Colors</h2>

                              <div className="space-y-2">
                                   <p className="text-primary">Primary text color</p>
                                   <p className="text-accent">Accent text color</p>
                                   <p className="text-gray-900 dark:text-gray-100">Main text</p>
                                   <p className="text-gray-700 dark:text-gray-300">Secondary text</p>
                                   <p className="text-gray-600 dark:text-gray-400">Tertiary text</p>
                                   <p className="text-gray-500 dark:text-gray-500">Muted text</p>
                              </div>
                         </div>

                         {/* Upload Service Status */}
                         <div className="col-span-1 md:col-span-2">
                              <UploadServiceStatus />
                         </div>

                    </div>
               </div>
          </div>
     );
};

export default Test; 
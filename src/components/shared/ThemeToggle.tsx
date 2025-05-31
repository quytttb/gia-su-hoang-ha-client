import { useTheme } from '../../contexts/ThemeContext';

const ThemeToggle = () => {
     const { theme, setTheme } = useTheme();

     const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
          setTheme(e.target.value as 'light' | 'dark' | 'system');
     };

     return (
          <div className="flex items-center">
               {/* Theme Selector Dropdown with Icon */}
               <select
                    value={theme}
                    onChange={handleThemeChange}
                    className="text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-400 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    title="Chọn chế độ hiển thị"
               >
                    <option value="light" className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                         ☀️ Sáng
                    </option>
                    <option value="dark" className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                         🌙 Tối
                    </option>
                    <option value="system" className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                         💻 Tự động
                    </option>
               </select>
          </div>
     );
};

export default ThemeToggle; 
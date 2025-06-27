import React, { useState } from 'react';

interface DevFormHelperProps {
     onFillForm: (data: any) => void;
     onClearForm: () => void;
}

const testDataSets = [
     {
          name: 'Dataset 1',
          data: {
               parentName: 'Nguyễn Văn An',
               parentPhone: '0987654321',
               parentAddress: '123 Đường ABC, Phường XYZ, Quận 123, TP.HCM',
               name: 'Nguyễn Thị Bình',
               school: 'Trường THPT Lê Quý Đôn',
               academicDescription: 'Học sinh khá, cần cải thiện môn Toán và Vật Lý. Có hứng thú với môn Văn và Tiếng Anh.'
          }
     },
     {
          name: 'Dataset 2',
          data: {
               parentName: 'Trần Thị Lan',
               parentPhone: '0912345678',
               parentAddress: '456 Đường DEF, Phường ABC, Quận 456, Hà Nội',
               name: 'Trần Văn Cường',
               school: 'Trường THPT Chu Văn An',
               academicDescription: 'Học sinh giỏi Toán, cần phát triển thêm kỹ năng Tiếng Anh và Văn.'
          }
     },
     {
          name: 'Dataset 3',
          data: {
               parentName: 'Lê Hoàng Nam',
               parentPhone: '0923456789',
               parentAddress: '789 Đường GHI, Phường DEF, Quận 789, Đà Nẵng',
               name: 'Lê Thị Mai',
               school: 'Trường THPT Phan Châu Trinh',
               academicDescription: 'Học sinh trung bình, cần hỗ trợ toàn diện các môn học.'
          }
     },
     {
          name: 'Validation Test',
          data: {
               parentName: 'Test User',
               parentPhone: '0123456789',
               parentAddress: 'Test Address',
               name: 'Test Student',
               school: 'Test School',
               academicDescription: 'Test description for validation'
          }
     },
     {
          name: 'Edge Case Test',
          data: {
               parentName: 'Người Dùng Có Tên Rất Dài Để Test Validation Giới Hạn Ký Tự',
               parentPhone: '0999999999',
               parentAddress: 'Địa chỉ rất dài để test validation: 123/456/789 Đường ABCDEFGHIJK, Phường MNOPQRST, Quận UVWXYZ, TP.HCM, Việt Nam',
               name: 'Học Sinh Có Tên Rất Dài',
               school: 'Trường THPT Có Tên Rất Dài Để Test',
               academicDescription: 'Mô tả rất dài về lực học của học sinh để test validation giới hạn ký tự và xem form có xử lý được không. Học sinh này có nhiều điểm mạnh và yếu cần được hỗ trợ.'
          }
     }
];

const DevFormHelper: React.FC<DevFormHelperProps> = ({ onFillForm, onClearForm }) => {
     const [isExpanded, setIsExpanded] = useState(false);
     const [selectedDataset, setSelectedDataset] = useState(0);

     // Only show in development mode
     if (process.env.NODE_ENV !== 'development') {
          return null;
     }

     const handleFillForm = (datasetIndex: number) => {
          const dataset = testDataSets[datasetIndex];
          console.log(`🚀 Filling form with ${dataset.name}:`, dataset.data);
          onFillForm(dataset.data);
     };

     const handleQuickFill = () => {
          handleFillForm(selectedDataset);
     };

     const handleRandomFill = () => {
          const randomIndex = Math.floor(Math.random() * testDataSets.length);
          setSelectedDataset(randomIndex);
          handleFillForm(randomIndex);
     };

     return (
          <div className="fixed top-4 right-4 z-50">
               {/* Toggle Button */}
               <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg shadow-lg text-sm font-medium transition-colors duration-200"
                    title="Development Form Helper"
               >
                    🛠️ Dev Tools {isExpanded ? '▼' : '▶'}
               </button>

               {/* Expanded Panel */}
               {isExpanded && (
                    <div className="absolute top-12 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-4 min-w-[280px]">
                         <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
                              🚀 Form Auto Fill
                         </h3>

                         {/* Quick Actions */}
                         <div className="space-y-2 mb-4">
                              <div className="flex gap-2">
                                   <button
                                        onClick={handleQuickFill}
                                        className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-xs font-medium transition-colors duration-200"
                                   >
                                        🚀 Quick Fill
                                   </button>
                                   <button
                                        onClick={handleRandomFill}
                                        className="flex-1 bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded text-xs font-medium transition-colors duration-200"
                                   >
                                        🎲 Random
                                   </button>
                                   <button
                                        onClick={onClearForm}
                                        className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-xs font-medium transition-colors duration-200"
                                   >
                                        🧹 Clear
                                   </button>
                              </div>
                         </div>

                         {/* Dataset Selection */}
                         <div className="mb-3">
                              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                   Select Dataset:
                              </label>
                              <select
                                   value={selectedDataset}
                                   onChange={(e) => setSelectedDataset(Number(e.target.value))}
                                   className="w-full text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                              >
                                   {testDataSets.map((dataset, index) => (
                                        <option key={index} value={index}>
                                             {dataset.name}
                                        </option>
                                   ))}
                              </select>
                         </div>

                         {/* Individual Dataset Buttons */}
                         <div className="space-y-1">
                              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Or fill with specific dataset:</p>
                              {testDataSets.map((dataset, index) => (
                                   <button
                                        key={index}
                                        onClick={() => handleFillForm(index)}
                                        className="w-full text-left bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-2 py-1 rounded text-xs transition-colors duration-200"
                                   >
                                        📊 {dataset.name}
                                   </button>
                              ))}
                         </div>

                         {/* Info */}
                         <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                   💡 Dev mode only. Hidden in production.
                              </p>
                         </div>
                    </div>
               )}
          </div>
     );
};

export default DevFormHelper;

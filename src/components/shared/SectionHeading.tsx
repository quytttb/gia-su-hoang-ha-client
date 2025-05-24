import React from 'react';

interface SectionHeadingProps {
     title: string;
     subtitle?: string;
     centered?: boolean;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({
     title,
     subtitle,
     centered = true
}) => {
     return (
          <div className={`mb-10 ${centered ? 'text-center' : ''}`}>
               <h2 className="text-3xl font-bold text-gray-800 mb-3">{title}</h2>
               {subtitle && <p className="text-gray-600 max-w-3xl mx-auto">{subtitle}</p>}
               <div className={`h-1 w-20 bg-primary mt-4 ${centered ? 'mx-auto' : ''}`}></div>
          </div>
     );
};

export default SectionHeading; 
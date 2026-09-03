import React from 'react';
import { useNavigate } from 'react-router-dom';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
  onClick?: () => void;
  showSubtitle?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  variant = 'dark',
  onClick,
  showSubtitle = true,
  className = '',
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) onClick();
    else navigate('/');
  };

  const imgSizeMap = {
    sm: 'w-7 h-7 rounded-lg',
    md: 'w-9 h-9 rounded-xl',
    lg: 'w-11 h-11 rounded-2xl',
  };

  const titleSizeMap = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div
      onClick={handleClick}
      className={`flex items-center gap-2.5 cursor-pointer select-none group ${className}`}
    >
      <img
        src="/arthsetu-logo.jpg"
        alt="arthsetu logo"
        className={`${imgSizeMap[size]} object-cover shadow-md border border-emerald-500/20 group-hover:scale-105 transition-transform duration-200`}
      />
      <div>
        <div className={`font-black tracking-tight leading-none ${titleSizeMap[size]}`}>
          <span className={variant === 'light' ? 'text-white' : 'text-[#172033]'}>arth</span>
          <span className="text-[#10B981]">setu</span>
        </div>
        {showSubtitle && (
          <span className={`text-[10px] font-extrabold tracking-tight block mt-0.5 ${
            variant === 'light' ? 'text-blue-200' : 'text-[#64748B]'
          }`}>
            Investment Intelligence
          </span>
        )}
      </div>
    </div>
  );
};

export default BrandLogo;

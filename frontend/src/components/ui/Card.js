import React from 'react';

/**
 * Card Component
 * 
 * A versatile card component for content grouping with various styling options.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} [props.title] - Card title
 * @param {string} [props.subtitle] - Card subtitle
 * @param {React.ReactNode} [props.icon] - Icon component to display next to the title
 * @param {React.ReactNode} [props.footer] - Footer content
 * @param {string} [props.className] - Additional CSS classes for the card
 * @param {string} [props.variant='default'] - Card style variant: 'default', 'primary', 'success', 'warning', 'danger'
 * @param {boolean} [props.withHover=false] - Apply hover effect
 * @param {Function} [props.onClick] - Click handler for the entire card
 */
const Card = ({ 
  children, 
  title, 
  subtitle,
  icon,
  footer,
  className = '',
  variant = 'default',
  withHover = false,
  onClick
}) => {
  // Define variant-based styles
  const variantStyles = {
    default: 'bg-white border-gray-200',
    primary: 'bg-blue-600 text-white border-blue-700',
    success: 'bg-green-600 text-white border-green-700',
    warning: 'bg-yellow-100 border-yellow-200 text-yellow-800',
    danger: 'bg-red-100 border-red-200 text-red-800'
  };

  // Combine class names
  const cardClasses = [
    'rounded-lg border shadow-sm',
    variantStyles[variant] || variantStyles.default,
    withHover ? 'transition-shadow hover:shadow-md' : '',
    onClick ? 'cursor-pointer' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={cardClasses}
      onClick={onClick}
    >
      {/* Card header - conditionally rendered if title is present */}
      {(title || subtitle) && (
        <div className={`px-4 py-3 border-b ${variant === 'default' ? 'border-gray-200' : 'border-opacity-20 border-white'}`}>
          <div className="flex items-center">
            {/* Icon is optional */}
            {icon && <div className="mr-2">{icon}</div>}
            
            <div>
              {/* Title */}
              {title && <h3 className="font-medium text-lg">{title}</h3>}
              
              {/* Subtitle is optional */}
              {subtitle && <div className={`text-sm ${variant === 'default' ? 'text-gray-500' : 'text-opacity-80'}`}>{subtitle}</div>}
            </div>
          </div>
        </div>
      )}
      
      {/* Card body - always rendered */}
      <div className="card-body">
        {children}
      </div>
      
      {/* Card footer - conditionally rendered if footer is present */}
      {footer && (
        <div className={`px-4 py-3 border-t ${variant === 'default' ? 'border-gray-200' : 'border-opacity-20 border-white'}`}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card; 
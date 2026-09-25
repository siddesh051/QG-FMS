import React from 'react';

export interface PageHeaderProps {
  breadcrumbs?: Array<{ label: string; active?: boolean }>;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  breadcrumbs,
  title,
  subtitle,
  icon,
  actions,
  className = '',
}) => {
  return (
    <div
      className={`bg-[#1a365d] rounded-xl px-5 py-4 text-white shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${className}`}
    >
      <div className="min-w-0">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-sky-200/90 font-mono mb-1">
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <React.Fragment key={idx}>
                  <span className={isLast || crumb.active ? 'text-white font-semibold' : 'text-sky-300 font-semibold'}>
                    {crumb.label}
                  </span>
                  {!isLast && <span className="text-sky-400/50">/</span>}
                </React.Fragment>
              );
            })}
          </div>
        )}
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          {icon && <span className="text-sky-300 shrink-0">{icon}</span>}
          <span>{title}</span>
        </h1>
        {subtitle && (
          <p className="text-xs text-sky-100/85 mt-1 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div className="shrink-0 self-start sm:self-center">
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;

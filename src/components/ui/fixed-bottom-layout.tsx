import React from "react";

interface FixedBottomLayoutProps {
  children: React.ReactNode;
  bottomContent: React.ReactNode;
}

export function FixedBottomLayout({
  children,
  bottomContent,
}: FixedBottomLayoutProps) {
  return (
    <div className='flex flex-col h-full'>
      {/* 可滚动的内容区域 */}
      <div className='flex-1 overflow-y-auto min-h-0 pb-4'>{children}</div>

      {/* 固定在底部的内容 */}
      <div className='flex-shrink-0 pt-4 pb-2 bg-white border-t'>
        {bottomContent}
      </div>
    </div>
  );
}

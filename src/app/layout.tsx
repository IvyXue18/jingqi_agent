import type {Metadata} from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "鲸奇私域智能体",
  description: "通过AI对话创建个性化的用户运营策略",
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang='zh-CN'>
      <body className='min-h-screen bg-background font-sans antialiased'>
        {children}
      </body>
    </html>
  );
}

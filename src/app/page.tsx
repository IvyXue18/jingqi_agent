"use client";

import {ChatInterface} from "@/components/chat/ChatInterface";

export default function HomePage() {
  return (
    <main className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
      <div className='w-full py-4'>
        <div className='text-center mb-4'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            鲸奇私域智能体
          </h1>
          <p className='text-lg text-gray-600'>
            通过AI对话创建个性化的用户运营策略，让私域运营变得简单高效
          </p>
        </div>

        <ChatInterface />
      </div>
    </main>
  );
}

"use client";

import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {Badge} from "@/components/ui/badge";
import {Bot, User} from "lucide-react";
import {cn} from "@/lib/utils";
import {Message} from "@/lib/store";

interface MessageListProps {
  messages: Message[];
}

export function MessageList({messages}: MessageListProps) {
  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatContent = (content: string) => {
    // 支持简单的markdown格式
    return content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br />");
  };

  if (messages.length === 0) {
    return (
      <div className='flex items-center justify-center h-32 text-gray-500'>
        <div className='text-center'>
          <Bot className='w-8 h-8 mx-auto mb-2 opacity-50' />
          <p>暂无消息，开始对话吧！</p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {messages.map((message) => {
        const isUser = message.type === "user";

        return (
          <div
            key={message.id}
            className={cn("flex gap-3", {
              "flex-row-reverse": isUser,
            })}>
            {/* 头像 */}
            <div className='flex-shrink-0'>
              <Avatar
                className={cn("w-8 h-8", {
                  "bg-blue-500": !isUser,
                  "bg-green-500": isUser,
                })}>
                <AvatarFallback className='text-white text-sm'>
                  {isUser ? (
                    <User className='w-4 h-4' />
                  ) : (
                    <Bot className='w-4 h-4' />
                  )}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* 消息内容 */}
            <div
              className={cn("flex flex-col max-w-[80%]", {
                "items-end": isUser,
                "items-start": !isUser,
              })}>
              {/* 消息气泡 */}
              <div
                className={cn("rounded-lg px-4 py-2 shadow-sm", {
                  "bg-blue-500 text-white": !isUser,
                  "bg-gray-100 text-gray-900": isUser,
                })}>
                <div
                  className='text-sm leading-relaxed'
                  dangerouslySetInnerHTML={{
                    __html: formatContent(message.content),
                  }}
                />
              </div>

              {/* 消息元信息 */}
              <div
                className={cn(
                  "flex items-center gap-2 mt-1 text-xs text-gray-500",
                  {
                    "flex-row-reverse": isUser,
                  },
                )}>
                <span>{formatTime(message.timestamp)}</span>
                {message.step && (
                  <Badge
                    variant='outline'
                    className='text-xs'>
                    步骤 {message.step}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

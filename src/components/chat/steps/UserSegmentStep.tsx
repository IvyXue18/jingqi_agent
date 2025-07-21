"use client";

import {useState} from "react";
import {Card} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {
  Users,
  CheckCircle,
  Settings,
  Tag,
  AlertTriangle,
  Bot,
  UserPlus,
  Cog,
  HandIcon,
} from "lucide-react";
import {cn} from "@/lib/utils";
import {useAppStore} from "@/lib/store";
import {userSegmentOptions} from "@/lib/mock-data";

export function UserSegmentStep() {
  const {userSegments, setUserSegments, currentStep, addMessage} =
    useAppStore();

  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    userSegments.length > 0 ? userSegments.map((seg) => seg.type) : [],
  );

  if (currentStep < 4) {
    return (
      <div className='text-center text-gray-500 py-8'>
        <div className='text-sm'>请先完成前面的步骤</div>
      </div>
    );
  }

  const handleSelectOption = (optionId: string) => {
    const option = userSegmentOptions.find((opt) => opt.id === optionId);
    if (!option) return;

    // 更新选中状态
    const newSelected = selectedOptions.includes(optionId)
      ? selectedOptions.filter((id) => id !== optionId)
      : [...selectedOptions, optionId];
    setSelectedOptions(newSelected);

    // 更新分层设置
    const selectedSegments = userSegmentOptions
      .filter((opt) => newSelected.includes(opt.id))
      .flatMap((opt) => opt.segments);
    setUserSegments(selectedSegments);

    // 添加确认消息
    if (newSelected.length > selectedOptions.length) {
      addMessage({
        type: "assistant",
        content: `✅ 已添加「${option.name}」分层策略！\n\n${
          option.id === "new"
            ? "系统将自动为所有新添加的企业微信好友创建跟进SOP。"
            : option.id === "auto"
            ? "系统将根据设定的条件自动为用户打标签。注意：部分功能可能需要额外配置。"
            : "已创建标签组，您可以根据实际情况手动为用户打标签。"
        }`,
        step: 4,
      });
    }

    // 如果是最后一个分层被选中，添加完成消息
    if (newSelected.length === 1 && selectedOptions.length === 0) {
      setTimeout(() => {
        addMessage({
          type: "assistant",
          content: `🎉 **恭喜！您的私域运营策略已创建完成：**\n\n📋 **配置总结**：\n• 业务场景：已选择\n• 业务信息：已分析提取\n• 内容序列：已生成 ${4} 个\n• 用户分层：${
            selectedSegments.length
          } 个分层\n\n🚀 **下一步建议**：\n• 预览并调整内容模板\n• 设置发送时间和频率\n• 配置自动化触发条件\n• 开始执行运营策略\n\n感谢使用私域运营智能助手！`,
          step: 4,
        });
      }, 500);
    }
  };

  const getOptionIcon = (optionId: string) => {
    switch (optionId) {
      case "new":
        return <UserPlus className='w-5 h-5 text-blue-600' />;
      case "auto":
        return <Bot className='w-5 h-5 text-purple-600' />;
      case "manual":
        return <HandIcon className='w-5 h-5 text-orange-600' />;
      default:
        return <Tag className='w-5 h-5 text-gray-600' />;
    }
  };

  return (
    <div className='space-y-4'>
      <div className='text-sm text-gray-600 mb-4'>
        👥 <strong>用户分层</strong>：选择合适的用户分层策略
      </div>

      <div className='space-y-3'>
        {userSegmentOptions.map((option) => {
          const isSelected = selectedOptions.includes(option.id);

          return (
            <Card
              key={option.id}
              className={cn(
                "p-4 cursor-pointer transition-all duration-200 hover:shadow-md",
                {
                  "ring-2 ring-blue-500 bg-blue-50": isSelected,
                  "hover:bg-gray-50": !isSelected,
                },
              )}
              onClick={() => handleSelectOption(option.id)}>
              <div className='space-y-4'>
                {/* 选项标题 */}
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center'>
                      {getOptionIcon(option.id)}
                    </div>
                    <div>
                      <h3 className='font-medium text-gray-900'>
                        {option.name}
                      </h3>
                      <p className='text-sm text-gray-600'>
                        {option.description}
                      </p>
                    </div>
                  </div>
                  {isSelected && (
                    <Badge
                      variant='default'
                      className='bg-green-500'>
                      <CheckCircle className='w-3 h-3 mr-1' />
                      已选择
                    </Badge>
                  )}
                </div>

                {/* 分层预览 */}
                <div className='grid grid-cols-1 gap-2'>
                  {option.segments.map((segment) => (
                    <div
                      key={segment.id}
                      className='flex items-start gap-3 p-3 bg-white rounded border'>
                      <div
                        className='w-2 h-2 rounded-full flex-shrink-0 mt-2'
                        style={{backgroundColor: segment.color}}
                      />
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center gap-2'>
                          <span className='text-sm font-medium text-gray-900'>
                            {segment.name}
                          </span>
                          <Badge
                            variant='outline'
                            className='text-xs'>
                            {segment.tag}
                          </Badge>
                        </div>
                        <div className='text-xs text-gray-600 mt-1'>
                          {segment.criteria}
                        </div>
                        {segment.requirements &&
                          segment.requirements.length > 0 && (
                            <div className='flex items-center gap-1 mt-2 text-xs text-amber-600'>
                              <AlertTriangle className='w-3 h-3' />
                              <span>
                                需要配置：{segment.requirements.join("、")}
                              </span>
                            </div>
                          )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* 配置提示 */}
                {isSelected && option.id === "auto" && (
                  <div className='flex items-center gap-2 mt-2 p-2 bg-amber-50 rounded text-xs text-amber-700'>
                    <Settings className='w-3 h-3' />
                    <span>部分功能需要额外配置，可以随时切换到手动打标签</span>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* 已配置的分层统计 */}
      {userSegments.length > 0 && (
        <Card className='p-4 bg-green-50 border-green-200'>
          <div className='flex items-center gap-2 mb-3'>
            <Cog className='w-4 h-4 text-green-600' />
            <span className='font-medium text-green-900'>配置完成</span>
          </div>

          <div className='space-y-2'>
            <div className='text-sm text-green-800 mb-2'>
              已配置 {userSegments.length} 个用户分层：
            </div>

            {/* 分层类型统计 */}
            <div className='space-y-1'>
              {["new", "auto", "manual"].map((type) => {
                const count = userSegments.filter(
                  (seg) => seg.type === type,
                ).length;
                if (count === 0) return null;
                return (
                  <div
                    key={type}
                    className='flex items-center gap-2'>
                    <div className='w-2 h-2 rounded-full bg-green-600' />
                    <span className='text-sm text-green-800'>
                      {type === "new"
                        ? "新客户SOP"
                        : type === "auto"
                        ? "自动标签"
                        : "手动标签"}
                      : {count} 个
                    </span>
                  </div>
                );
              })}
            </div>

            <div className='mt-3 pt-3 border-t border-green-200'>
              <div className='flex items-center gap-1 text-sm text-green-700'>
                <CheckCircle className='w-4 h-4' />
                分层配置完成，可以开始执行运营计划！
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

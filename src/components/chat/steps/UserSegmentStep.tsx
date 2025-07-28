"use client";

import {useState} from "react";
import {Card} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {
  Users,
  CheckCircle,
  Tag,
  UserPlus,
  ChevronRight,
  Edit3,
} from "lucide-react";
import {cn} from "@/lib/utils";
import {useAppStore} from "@/lib/store";
import {userSegmentOptions} from "@/lib/mock-data";
import {UserSegment} from "@/lib/store";

export function UserSegmentStep() {
  const {userSegments, setUserSegments, currentStep, addMessage} =
    useAppStore();

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [conditionInput, setConditionInput] = useState("");
  const [tagName, setTagName] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  if (currentStep < 4) {
    return (
      <div className='text-center text-gray-500 py-8'>
        <div className='text-sm'>请先完成前面的步骤</div>
      </div>
    );
  }

  const handleSelectOption = (optionId: string) => {
    setSelectedOption(optionId);
    setConditionInput("");
    setTagName("");
    setIsEditing(false);

    if (optionId === "new_user") {
      // 创建新客户SOP
      const newSegment: UserSegment = {
        id: "new-user-sop",
        name: "新客户SOP",
        type: "new_user",
        color: "#3B82F6",
        tag: "新客户",
        taskId: "task-" + Date.now(), // 生成任务ID
      };

      setUserSegments([newSegment]);
      addMessage({
        type: "assistant",
        content: `✅ 搞定！新客户SOP已经给你安排上了！\n\n你知道最头疼的是什么吗？\n新加的企微好友，发个"您好"就石沉大海了。\n你想跟进吧，不知道说啥；\n不跟进吧，眼睁睁看着客户流失。\n\n现在好了，系统直接帮你解决这个痛点。\n\n每个新加的企微好友，都会自动跑这个内容流程，不用你操心，不用你记着，更不用你熬夜想文案。点击右边的"查看任务"按钮，看看完整的配置。`,
        step: 4,
      });
    }
  };

  const handleSubmitCondition = () => {
    if (!conditionInput.trim()) return;

    const defaultTag = tagName.trim() || `${conditionInput.slice(0, 10)}用户`;

    const newSegment: UserSegment = {
      id: "condition-" + Date.now(),
      name: "特定条件用户",
      type: "specific_condition",
      criteria: conditionInput,
      color: "#F97316",
      tag: defaultTag,
      taskId: "task-" + Date.now(), // 生成任务ID
    };

    setUserSegments([newSegment]);
    setIsEditing(false);

    addMessage({
      type: "assistant",
      content: `✅ 系统已创建标签「${defaultTag}」！\n\n💡 后续使用方法：\n• 手动为符合条件的用户打上「${defaultTag}」标签\n• 系统将自动为这些用户执行对应的跟进流程和内容\n• 内容序列会按设定的时间自动发送任务\n\n点击右边的"查看任务"按钮，查看完整的跟进配置。`,
      step: 4,
    });
  };

  const handleViewTask = (taskId: string) => {
    // 使用 Next.js 的路由跳转到任务详情页
    window.location.href = `/task/${taskId}`;
  };

  return (
    <div className='space-y-4'>
      <div className='text-sm text-gray-600 mb-4'>
        👥 <strong>用户分层</strong>：选择目标用户群体
      </div>

      <div className='space-y-3'>
        {userSegmentOptions.map((option) => {
          const isSelected = selectedOption === option.id;

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
                      {option.id === "new_user" ? (
                        <UserPlus className='w-5 h-5 text-blue-600' />
                      ) : (
                        <Tag className='w-5 h-5 text-orange-600' />
                      )}
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
                </div>

                {/* 特定条件输入 */}
                {isSelected && option.id === "specific_condition" && (
                  <div className='space-y-3 pt-2'>
                    <div className='space-y-2'>
                      <label className='text-sm text-gray-700'>
                        请描述目标用户特征：
                      </label>
                      <Input
                        value={conditionInput}
                        onChange={(e) => setConditionInput(e.target.value)}
                        placeholder='例如：已做过产品演示的高意向用户'
                        className='w-full'
                      />
                    </div>
                    {conditionInput && !isEditing && (
                      <div className='space-y-2'>
                        <div className='flex items-center justify-between'>
                          <span className='text-sm text-gray-700'>
                            将创建标签：
                            {tagName || `${conditionInput.slice(0, 10)}用户`}
                          </span>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsEditing(true);
                            }}>
                            <Edit3 className='w-3 h-3 mr-1' />
                            修改
                          </Button>
                        </div>
                      </div>
                    )}
                    {isEditing && (
                      <div className='space-y-2'>
                        <label className='text-sm text-gray-700'>
                          自定义标签名称：
                        </label>
                        <Input
                          value={tagName}
                          onChange={(e) => setTagName(e.target.value)}
                          placeholder='输入标签名称'
                          className='w-full'
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    )}
                    <Button
                      className='w-full'
                      disabled={!conditionInput.trim()}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isEditing) {
                          setIsEditing(false);
                        } else {
                          handleSubmitCondition();
                        }
                      }}>
                      {isEditing ? "确认标签" : "创建标签"}
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* 已配置的分层展示 */}
      {userSegments.length > 0 && (
        <Card className='p-4 bg-green-50 border-green-200'>
          <div className='flex items-center gap-2 mb-3'>
            <CheckCircle className='w-4 h-4 text-green-600' />
            <span className='font-medium text-green-900'>配置完成</span>
          </div>

          <div className='space-y-3'>
            {userSegments.map((segment) => (
              <div
                key={segment.id}
                className='bg-white rounded-lg p-3 border border-green-100'>
                <div className='flex items-start justify-between'>
                  <div className='space-y-1'>
                    <div className='flex items-center gap-2'>
                      <div
                        className='w-2 h-2 rounded-full'
                        style={{backgroundColor: segment.color}}
                      />
                      <span className='font-medium text-gray-900'>
                        {segment.type === "new_user"
                          ? "新客户SOP"
                          : "特定条件用户"}
                      </span>
                    </div>
                    {segment.type === "specific_condition" && (
                      <>
                        <div className='text-sm text-gray-600'>
                          条件：{segment.criteria}
                        </div>
                        <div className='flex items-center gap-2'>
                          <Badge variant='outline'>{segment.tag}</Badge>
                          <Badge
                            variant='default'
                            className='bg-orange-500'>
                            手动打标签
                          </Badge>
                        </div>
                      </>
                    )}
                  </div>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => handleViewTask(segment.taskId!)}>
                    查看任务
                    <ChevronRight className='w-4 h-4 ml-1' />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

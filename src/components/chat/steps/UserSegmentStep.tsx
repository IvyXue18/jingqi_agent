"use client";

import {useState} from "react";
import {Card} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {
  Users,
  CheckCircle,
  Settings,
  Tag,
  AlertTriangle,
  Bot,
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

  interface AutoConditionResult {
    canAutomate: boolean; // 是否可以自动化
    reason?: string; // 不能自动化的原因
    requirements?: string[]; // 需要的配置
    suggestedTag?: string; // 建议的标签名
  }

  const automatableConditions = {
    // 行为类
    behavior: {
      keywords: [
        "查看",
        "浏览",
        "点击",
        "访问",
        "收藏",
        "加购",
        "下单",
        "购买",
        "支付",
        "登录",
        "注册",
      ],
      requirements: (matched) => {
        if (matched.includes("购买")) return ["订单系统对接"];
        if (matched.includes("查看")) return ["配置查看商品事件"];
        return [];
      },
    },
    // 互动类
    interaction: {
      keywords: ["发消息", "互动", "回复", "咨询", "提问"],
      requirements: () => ["开通会话存档"],
    },
    // 时间类
    time: {
      keywords: ["加入", "注册", "关注", "首次", "最后"],
      requirements: () => [],
    },
  };

  const checkAutoCondition = (condition: string): AutoConditionResult => {
    const lowerCaseCondition = condition.toLowerCase();
    let canAutomate = false;
    let reason: string | undefined;
    let requirements: string[] = [];
    let suggestedTag: string | undefined;

    // 检查是否包含具体数值
    const numberMatch = lowerCaseCondition.match(/(\d+)\s*(\w+)/);
    if (!numberMatch) {
      reason = "条件中必须包含具体数值，例如：'3次'、'5次'、'10天'等。";
      return {canAutomate: false, reason};
    }

    const quantity = parseInt(numberMatch[1], 10);
    const unit = numberMatch[2];

    // 检查是否包含可自动化的行为/状态关键词
    for (const category in automatableConditions) {
      const categoryData =
        automatableConditions[category as keyof typeof automatableConditions];
      if (
        categoryData.keywords.some((keyword) =>
          lowerCaseCondition.includes(keyword),
        )
      ) {
        canAutomate = true;
        if (category === "behavior") {
          const matchedKeywords = categoryData.keywords.filter((keyword) =>
            lowerCaseCondition.includes(keyword),
          );
          if (
            matchedKeywords.includes("购买") ||
            matchedKeywords.includes("查看")
          ) {
            requirements = categoryData.requirements(matchedKeywords);
          }
        } else if (category === "interaction") {
          requirements = categoryData.requirements();
        }
        break;
      }
    }

    if (!canAutomate) {
      reason =
        "条件中必须包含可自动化的行为或状态关键词，例如：'查看'、'浏览'、'发消息'、'互动'、'下单'、'支付'、'登录'、'注册'等。";
      return {canAutomate: false, reason};
    }

    // 如果可以自动化，尝试生成建议的标签名
    if (condition.includes("用户")) {
      suggestedTag = `${condition
        .slice(0, condition.indexOf("用户"))
        .trim()}用户`;
    } else {
      suggestedTag = `${condition.slice(0, 10).trim()}用户`;
    }

    return {canAutomate, requirements, suggestedTag};
  };

  // 获取自动化所需配置
  const getRequirements = (condition: string): string[] => {
    const requirements: string[] = [];
    if (condition.includes("消息") || condition.includes("互动")) {
      requirements.push("开通会话存档");
    }
    if (condition.includes("订单") || condition.includes("购买")) {
      requirements.push("订单系统对接");
    }
    if (condition.includes("查看") || condition.includes("浏览")) {
      requirements.push("配置查看商品事件");
    }
    return requirements;
  };

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
        content: `✅ 已创建新客户SOP！\n\n系统将自动为所有新添加的企业微信好友创建跟进流程。\n\n您可以点击下方的"查看任务"按钮，查看完整的跟进配置。`,
        step: 4,
      });
    }
  };

  const handleSubmitCondition = () => {
    if (!conditionInput.trim()) return;

    const isAuto = checkAutoCondition(conditionInput);
    const requirements = isAuto ? getRequirements(conditionInput) : [];
    const defaultTag = tagName.trim() || `${conditionInput.slice(0, 10)}用户`;

    const newSegment: UserSegment = {
      id: "condition-" + Date.now(),
      name: isAuto ? "自动条件" : "手动条件",
      type: "specific_condition",
      criteria: conditionInput,
      isAutoCondition: isAuto,
      requirements,
      color: isAuto ? "#10B981" : "#F97316",
      tag: defaultTag,
      taskId: "task-" + Date.now(), // 生成任务ID
    };

    setUserSegments([newSegment]);
    setIsEditing(false);

    addMessage({
      type: "assistant",
      content: isAuto
        ? `✅ 已创建自动条件分层！\n\n系统将根据以下条件自动为用户打标签：\n• 条件：${conditionInput}\n• 标签：${defaultTag}\n\n⚠️ 注意：需要配置以下功能才能启用自动判定：\n${requirements
            .map((r) => "• " + r)
            .join(
              "\n",
            )}\n\n您可以点击下方的"查看任务"按钮，查看完整的跟进配置。`
        : `✅ 已创建手动标签！\n\n由于条件"${conditionInput}"需要人工判断，系统已创建标签"${defaultTag}"。\n\n您需要手动为符合条件的用户打上此标签，系统将自动执行对应的跟进流程。\n\n您可以点击下方的"查看任务"按钮，查看完整的跟进配置。`,
      step: 4,
    });
  };

  const handleViewTask = (taskId: string) => {
    // TODO: 实现任务跳转逻辑
    console.log("跳转到任务:", taskId);
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
                        请描述用户需要满足的条件：
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
                      {isEditing ? "确认标签" : "创建分层"}
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
                          : "特定条件跟进"}
                      </span>
                    </div>
                    {segment.type === "specific_condition" && (
                      <>
                        <div className='text-sm text-gray-600'>
                          条件：{segment.criteria}
                        </div>
                        <div className='flex items-center gap-2'>
                          <Badge variant='outline'>{segment.tag}</Badge>
                          {segment.isAutoCondition ? (
                            <Badge
                              variant='default'
                              className='bg-emerald-500'>
                              <Bot className='w-3 h-3 mr-1' />
                              自动判定
                            </Badge>
                          ) : (
                            <Badge
                              variant='default'
                              className='bg-orange-500'>
                              手动打标签
                            </Badge>
                          )}
                        </div>
                        {segment.requirements &&
                          segment.requirements.length > 0 && (
                            <div className='flex items-center gap-1 mt-1 text-xs text-amber-600'>
                              <AlertTriangle className='w-3 h-3' />
                              <span>
                                需要配置：{segment.requirements.join("、")}
                              </span>
                            </div>
                          )}
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

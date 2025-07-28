"use client";

import {useState} from "react";
import {Card} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";

import {
  Building,
  Target,
  Users,
  TrendingUp,
  Edit3,
  Check,
  ArrowRight,
  Star,
  AlertCircle,
  Activity,
  MessageCircle,
  Hash,
} from "lucide-react";
import {useAppStore} from "@/lib/store";
import {FixedBottomLayout} from "@/components/ui/fixed-bottom-layout";

export function BusinessInfoStep() {
  const {businessInfo, currentStep, updateBusinessInfo, addMessage, nextStep} =
    useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    industry: businessInfo.industry || "",
    productService: businessInfo.productService || "",
    targetAudience: businessInfo.targetAudience || "",
    coreAdvantages: businessInfo.coreAdvantages || "",
    userPainPoints: businessInfo.userPainPoints || "",
    decisionPoints: businessInfo.decisionPoints || "",
    expectedAction: businessInfo.expectedAction || "",
    contentCount: businessInfo.contentCount || "",
    communicationStyle: businessInfo.communicationStyle || "",
  });

  // 如果当前步骤不是第二步，显示简化信息
  if (currentStep < 2) {
    return (
      <div className='text-center text-gray-500 py-8'>
        <div className='text-sm'>请先完成智能体选择</div>
      </div>
    );
  }

  // 如果还没有业务信息，显示等待状态
  if (Object.keys(businessInfo).length === 0) {
    return (
      <div className='space-y-4'>
        <div className='text-sm text-gray-600 mb-4'>
          💡 <strong>提示</strong>：请在左侧对话框中输入您的业务信息
        </div>

        <Card className='p-4 bg-blue-50 border-blue-200'>
          <h4 className='font-medium text-blue-900 mb-3'>
            💡 参考这些描述方式：
          </h4>

          <div className='space-y-3 text-sm text-blue-800'>
            <div className='bg-white/60 p-3 rounded-lg border border-blue-200'>
              <div className='font-medium text-blue-900 mb-1'>
                📚 在线教育示例：
              </div>
              <div className='text-blue-700 leading-relaxed'>
                &ldquo;我们是做在线教育的，主要卖职场技能课程，从199元的入门课到1999元的VIP服务。现在想对加到企微的新用户进行不硬广的触达，能够达成小客单入门课的成交。&rdquo;
              </div>
            </div>

            <div className='bg-white/60 p-3 rounded-lg border border-blue-200'>
              <div className='font-medium text-blue-900 mb-1'>
                🛒 电商零售示例：
              </div>
              <div className='text-blue-700 leading-relaxed'>
                &ldquo;我们是做母婴用品电商的，主要面向25-35岁新手妈妈。现在私域里有5000个宝妈用户，但复购率只有20%，希望通过内容运营提升到40%以上。&rdquo;
              </div>
            </div>

            <div className='bg-white/60 p-3 rounded-lg border border-blue-200'>
              <div className='font-medium text-blue-900 mb-1'>
                💰 金融保险示例：
              </div>
              <div className='text-blue-700 leading-relaxed'>
                &ldquo;我们是做理财规划的，目标客户是月收入1-3万的白领。现在有客户资源但转化率低，想通过持续的理财知识分享建立信任，最终推广我们的理财产品。&rdquo;
              </div>
            </div>

            <div className='bg-white/60 p-3 rounded-lg border border-blue-200'>
              <div className='font-medium text-blue-900 mb-1'>
                🏥 医美健康示例：
              </div>
              <div className='text-blue-700 leading-relaxed'>
                &ldquo;我们是医美诊所，主要做轻医美项目。目标用户是25-40岁爱美女性，想通过科普内容和案例分享，让用户从了解到信任，最终预约到店体验。&rdquo;
              </div>
            </div>

            <div className='bg-white/60 p-3 rounded-lg border border-blue-200'>
              <div className='font-medium text-blue-900 mb-1'>
                🏠 房产中介示例：
              </div>
              <div className='text-blue-700 leading-relaxed'>
                &ldquo;我们是房产中介，主要服务首次购房的年轻人。希望通过购房知识分享和政策解读，建立专业形象，让客户在有购房需求时第一时间想到我们。&rdquo;
              </div>
            </div>
          </div>

          <div className='mt-4 p-2 bg-blue-100/50 rounded text-xs text-blue-600'>
            ✨ 建议包含：行业类型、产品价格、目标用户、当前挑战、期望目标
          </div>
        </Card>
      </div>
    );
  }

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({
      industry: businessInfo.industry || "",
      productService: businessInfo.productService || "",
      targetAudience: businessInfo.targetAudience || "",
      coreAdvantages: businessInfo.coreAdvantages || "",
      userPainPoints: businessInfo.userPainPoints || "",
      decisionPoints: businessInfo.decisionPoints || "",
      expectedAction: businessInfo.expectedAction || "",
      contentCount: businessInfo.contentCount || "",
      communicationStyle: businessInfo.communicationStyle || "",
    });
  };

  const handleSave = () => {
    const updatedInfo = {
      ...businessInfo,
      industry: editData.industry,
      productService: editData.productService,
      targetAudience: editData.targetAudience,
      coreAdvantages: editData.coreAdvantages,
      userPainPoints: editData.userPainPoints,
      decisionPoints: editData.decisionPoints,
      expectedAction: editData.expectedAction,
      contentCount: editData.contentCount,
      communicationStyle: editData.communicationStyle,
    };

    updateBusinessInfo(updatedInfo);
    setIsEditing(false);

    addMessage({
      type: "assistant",
      content:
        '✅ 业务信息已更新！您可以继续修改，或者点击"确认信息"进入下一步。',
      step: 2,
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleConfirm = async () => {
    addMessage({
      type: "user",
      content: "信息确认无误，开始生成内容序列",
      step: 2,
    });

    addMessage({
      type: "assistant",
      content:
        "🎨 太好了！现在就给你搞一套内容序列\n\n✨ 内容生成中，大概 2-3 分钟，你先去喝杯水吧嘿嘿",
      step: 3,
    });

    // 进入下一步
    nextStep();

    // 调用内容生成
    setTimeout(async () => {
      const {mockContentGeneration} = await import("../../../lib/mock-data");
      const {
        selectedScenario,
        setContentSequences,
        addMessage: addMsg,
        setLoading,
      } = useAppStore.getState();

      if (!selectedScenario) return;

      setLoading(true);

      try {
        const generatedContent = await mockContentGeneration(
          selectedScenario.id,
        );
        setContentSequences(generatedContent);

        addMsg({
          type: "assistant",
          content: `🎉 搞定了！\n\n给你整了${
            generatedContent.length
          }条能直接用的内容：\n\n${generatedContent
            .map(
              (content, index) =>
                `第${index + 1}套 - ${content.title}，${content.description}`,
            )
            .join(
              "\n",
            )}\n\n右边面板看看内容，\n哪里不对劲直接改，\n改完咱们就配置用户分层。\n\n你说了算。`,
          step: 3,
        });
      } catch (error) {
        addMsg({
          type: "assistant",
          content: "抱歉，内容生成遇到了问题。请稍后重试。",
          step: 3,
        });
      } finally {
        setLoading(false);
      }
    }, 2000);
  };

  // 字段配置
  const fields = [
    {
      key: "industry",
      label: "行业领域",
      icon: Building,
      color: "blue",
      placeholder: "如：在线教育、电商零售、金融理财",
    },
    {
      key: "productService",
      label: "产品/服务",
      icon: Star,
      color: "green",
      placeholder: "如：职场技能课程、母婴用品、理财规划",
    },
    {
      key: "targetAudience",
      label: "目标受众",
      icon: Users,
      color: "purple",
      placeholder: "如：25-40岁职场人士、新手妈妈",
    },
    {
      key: "coreAdvantages",
      label: "核心优势",
      icon: TrendingUp,
      color: "orange",
      placeholder: "如：价格亲民、专业权威、效果显著",
    },
    {
      key: "userPainPoints",
      label: "用户痛点",
      icon: AlertCircle,
      color: "red",
      placeholder: "如：时间有限、效果担忧、价格敏感",
    },
    {
      key: "decisionPoints",
      label: "用户决策点",
      icon: Target,
      color: "indigo",
      placeholder: "如：品牌信誉、价格对比、专业建议",
      isTextarea: true,
    },
    {
      key: "expectedAction",
      label: "期望行动",
      icon: Activity,
      color: "teal",
      placeholder: "如：购买入门课、预约咨询、推荐朋友",
    },
    {
      key: "contentCount",
      label: "内容条数",
      icon: Hash,
      color: "gray",
      placeholder: "如：5-8条、6-10条",
    },
    {
      key: "communicationStyle",
      label: "沟通人设/风格",
      icon: MessageCircle,
      color: "pink",
      placeholder: "如：专业亲和、温暖可信、简洁高效",
      isTextarea: true,
    },
  ];

  const bottomContent = (
    <>
      {/* 编辑模式的操作按钮 */}
      {isEditing ? (
        <div className='flex gap-2'>
          <Button
            onClick={handleSave}
            size='sm'
            className='flex items-center gap-1'>
            <Check className='w-3 h-3' />
            保存修改
          </Button>
          <Button
            onClick={handleCancel}
            size='sm'
            variant='outline'>
            取消
          </Button>
        </div>
      ) : (
        <>
          <Button
            onClick={handleConfirm}
            size='lg'
            className='w-full flex items-center justify-center gap-2'>
            <Check className='w-4 h-4' />
            确认信息，生成内容序列
            <ArrowRight className='w-4 h-4' />
          </Button>

          {/* 操作提示 */}
          <div className='text-xs text-gray-500 bg-gray-50 p-3 rounded-lg mt-3'>
            💡
            请确认AI提取的信息是否准确。如需修改请点击&ldquo;编辑&rdquo;按钮，确认无误后点击&ldquo;确认信息&rdquo;进入下一步。
          </div>
        </>
      )}
    </>
  );

  const mainContent = (
    <>
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center gap-2'>
          <Badge variant='secondary'>已提取</Badge>
          <span className='text-sm text-gray-600'>AI分析结果</span>
        </div>
        {!isEditing && (
          <Button
            size='sm'
            variant='outline'
            onClick={handleEdit}
            className='flex items-center gap-1'>
            <Edit3 className='w-3 h-3' />
            编辑
          </Button>
        )}
      </div>

      <div className='space-y-3'>
        {fields.map((field) => {
          const Icon = field.icon;
          const value =
            (businessInfo[field.key as keyof typeof businessInfo] as string) ||
            "未填写";
          const editValue = editData[field.key as keyof typeof editData];

          return (
            <Card
              key={field.key}
              className='p-4'>
              <div className='space-y-3'>
                <div className='flex items-center gap-2'>
                  <Icon className={`w-4 h-4 text-${field.color}-500`} />
                  <span className='text-sm font-medium text-gray-700'>
                    {field.label}
                  </span>
                </div>

                {isEditing ? (
                  field.isTextarea ? (
                    <Textarea
                      value={editValue}
                      onChange={(e) =>
                        setEditData({...editData, [field.key]: e.target.value})
                      }
                      placeholder={field.placeholder}
                      className='min-h-[80px]'
                    />
                  ) : (
                    <Input
                      value={editValue}
                      onChange={(e) =>
                        setEditData({...editData, [field.key]: e.target.value})
                      }
                      placeholder={field.placeholder}
                    />
                  )
                ) : (
                  <div
                    className={`text-sm p-3 rounded-lg border ${
                      value === "未填写"
                        ? "bg-gray-50 text-gray-500"
                        : "bg-gray-50 text-gray-900"
                    }`}>
                    {value}
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );

  return (
    <FixedBottomLayout bottomContent={bottomContent}>
      {mainContent}
    </FixedBottomLayout>
  );
}

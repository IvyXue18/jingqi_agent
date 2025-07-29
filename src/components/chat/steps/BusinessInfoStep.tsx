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

// 统一业务信息输入组件
function UnifiedBusinessInput() {
  const [businessDescription, setBusinessDescription] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const {updateBusinessInfo, addMessage, nextStep} = useAppStore();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAnalyze = async () => {
    if (!businessDescription.trim() && uploadedFiles.length === 0) {
      return;
    }

    setIsAnalyzing(true);

    // 模拟AI处理业务信息（结合文字描述和文件内容）
    const {mockBusinessInfoExtraction} = await import("@/lib/mock-data");
    let analysisInput = businessDescription;

    // 如果有文件，模拟文件内容提取
    if (uploadedFiles.length > 0) {
      const fileNames = uploadedFiles.map((f) => f.name).join("、");
      analysisInput += `\n\n[已上传文件: ${fileNames}]`;
      // 在实际应用中，这里会调用文件解析API
    }

    const extractedInfo = await mockBusinessInfoExtraction(analysisInput);
    updateBusinessInfo(extractedInfo);

    // 添加AI回复
    addMessage({
      type: "assistant",
      content: `我给你理了一下，看看啊：\n\n【提取出的业务信息】\n• 行业领域：${
        extractedInfo.industry || "未识别"
      }\n• 产品/服务：${
        extractedInfo.productService || "未填写"
      }\n• 目标受众：${extractedInfo.targetAudience || "未填写"}\n• 核心优势：${
        extractedInfo.coreAdvantages || "未填写"
      }\n• 用户痛点：${extractedInfo.userPainPoints || "未填写"}\n• 期望行动：${
        extractedInfo.expectedAction || "未填写"
      }\n• 内容条数：${extractedInfo.contentCount || "未填写"}\n• 沟通风格：${
        extractedInfo.communicationStyle || "未填写"
      }\n\n这个方向对不对？\n\n如果没问题，右边确认一下就行。\n有哪里不准确的，直接改改，然后点"确认信息"。`,
      step: 2,
    });

    setIsAnalyzing(false);
  };

  return (
    <div className='space-y-6'>
      {/* 顶部引导提示 */}
      <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
        <div className='flex items-center gap-2 mb-2'>
          <div className='w-2 h-2 bg-blue-500 rounded-full animate-pulse'></div>
          <h3 className='font-medium text-blue-900'>
            请在此处填写您的业务信息
          </h3>
        </div>
        <p className='text-sm text-blue-700'>
          您可以通过文字描述、上传文件或两者结合的方式提供信息
        </p>
      </div>

      {/* 统一的业务信息输入组件 */}
      <div className='border border-gray-200 rounded-lg bg-white'>
        {/* 文件上传区域 - 放在顶部 */}
        <div className='p-4 border-b border-gray-100'>
          <h4 className='font-medium text-gray-900 mb-3 flex items-center gap-2'>
            📎 业务材料
            <span className='text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded'>
              如果有的话就上传，分析更细致
            </span>
          </h4>
          <div className='border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-200'>
            <input
              type='file'
              multiple
              accept='.pdf,.doc,.docx,.txt,.md'
              onChange={handleFileUpload}
              className='hidden'
              id='file-upload'
            />
            <label
              htmlFor='file-upload'
              className='cursor-pointer block'>
              <div className='text-gray-500'>
                <div className='text-xl mb-1'>📄</div>
                <div className='text-sm'>
                  <div className='font-medium text-gray-700 mb-1'>
                    点击上传或拖拽文件至此处
                  </div>
                  <div className='text-xs text-gray-500'>
                    支持：PDF、Word、文本文件
                  </div>
                </div>
              </div>
            </label>
          </div>

          {/* 已上传文件列表 */}
          {uploadedFiles.length > 0 && (
            <div className='mt-3 space-y-2'>
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className='flex items-center justify-between bg-gray-50 p-2 rounded'>
                  <span className='text-sm text-gray-700'>{file.name}</span>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => removeFile(index)}
                    className='h-6 w-6 p-0'>
                    ×
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 文字描述区域 - 中间 */}
        <div className='p-4'>
          <h4 className='font-medium text-gray-900 mb-3 flex items-center gap-2'>
            📝 业务描述
            <span className='text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded'>
              必填
            </span>
          </h4>
          <Textarea
            value={businessDescription}
            onChange={(e) => setBusinessDescription(e.target.value)}
            placeholder='请描述您的业务情况，✨ 建议包含：行业类型、产品价格、目标用户、当前挑战、期望目标。如果不知道怎么写，可以参考下面的示例。'
            className='min-h-[120px] resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            rows={5}
          />

          {/* 参考示例 - 放在文本框下方 */}
          <div className='mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4'>
            <h4 className='font-medium text-blue-900 mb-3 flex items-center gap-2'>
              💡 参考这些描述方式
            </h4>
            <div className='space-y-3 text-sm text-blue-800'>
              <div className='bg-white/60 p-3 rounded-lg border border-blue-200'>
                <div className='font-medium text-blue-900 mb-1'>
                  📚 在线教育示例：
                </div>
                <div className='text-blue-700 leading-relaxed'>
                  "我们是做在线教育的，主要卖职场技能课程，从199元的入门课到1999元的VIP服务。现在想对加到企微的新用户进行不硬广的触达，能够达成小客单入门课的成交。"
                </div>
              </div>

              <div className='bg-white/60 p-3 rounded-lg border border-blue-200'>
                <div className='font-medium text-blue-900 mb-1'>
                  🛒 电商零售示例：
                </div>
                <div className='text-blue-700 leading-relaxed'>
                  "我们是做母婴用品电商的，主要面向25-35岁新手妈妈。现在私域里有5000个宝妈用户，但复购率只有20%，希望通过内容运营提升到40%以上。"
                </div>
              </div>

              <div className='bg-white/60 p-3 rounded-lg border border-blue-200'>
                <div className='font-medium text-blue-900 mb-1'>
                  💰 金融保险示例：
                </div>
                <div className='text-blue-700 leading-relaxed'>
                  "我们是做理财规划的，目标客户是月收入1-3万的白领。现在有客户资源但转化率低，想通过持续的理财知识分享建立信任，最终推广我们的理财产品。"
                </div>
              </div>

              <div className='bg-white/60 p-3 rounded-lg border border-blue-200'>
                <div className='font-medium text-blue-900 mb-1'>
                  🏥 医美健康示例：
                </div>
                <div className='text-blue-700 leading-relaxed'>
                  "我们是医美诊所，主要做轻医美项目。目标用户是25-40岁爱美女性，想通过科普内容和案例分享，让用户从了解到信任，最终预约到店体验。"
                </div>
              </div>

              <div className='bg-white/60 p-3 rounded-lg border border-blue-200'>
                <div className='font-medium text-blue-900 mb-1'>
                  🏠 房产中介示例：
                </div>
                <div className='text-blue-700 leading-relaxed'>
                  "我们是房产中介，主要服务首次购房的年轻人。希望通过购房知识分享和政策解读，建立专业形象，让客户在有购房需求时第一时间想到我们。"
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 固定底部分析按钮 */}
      <div className='sticky bottom-0 bg-white border-t border-gray-200 p-4 -mx-4 -mb-4'>
        <Button
          onClick={handleAnalyze}
          disabled={
            (!businessDescription.trim() && uploadedFiles.length === 0) ||
            isAnalyzing
          }
          className='w-full py-3 text-base font-medium bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200'
          size='lg'>
          {isAnalyzing ? (
            <>
              <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2' />
              AI分析中...
            </>
          ) : (
            "🚀 开始分析"
          )}
        </Button>
      </div>
    </div>
  );
}

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

  // 如果还没有业务信息，显示统一输入界面
  if (Object.keys(businessInfo).length === 0) {
    return <UnifiedBusinessInput />;
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

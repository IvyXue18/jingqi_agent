// 业务信息步骤文案配置
export const businessTexts = {
  // 顶部引导
  guide: {
    title: "请在此处填写您的业务信息",
    description: "您可以通过文字描述、上传文件或两者结合的方式提供信息",
  },

  // 文件上传区域
  fileUpload: {
    title: "📎 业务材料",
    subtitle: "如果有的话就上传，分析更细致",
    uploadHint: "点击上传或拖拽文件至此处",
    supportedFormats: "支持：PDF、Word、文本文件",
  },

  // 业务描述区域
  businessDescription: {
    title: "📝 业务描述",
    required: "必填",
    placeholder:
      "请描述您的业务情况，✨ 建议包含：行业类型、产品价格、目标用户、当前挑战、期望目标。如果不知道怎么写，可以参考下面的示例。",
  },

  // 参考示例
  examples: {
    title: "💡 参考这些描述方式",
    education: {
      title: "📚 在线教育示例：",
      content:
        '"我们是做在线教育的，主要卖职场技能课程，从199元的入门课到1999元的VIP服务。现在想对加到企微的新用户进行不硬广的触达，能够达成小客单入门课的成交。"',
    },
    ecommerce: {
      title: "🛒 电商零售示例：",
      content:
        '"我们是做母婴用品电商的，主要面向25-35岁新手妈妈。现在私域里有5000个宝妈用户，但复购率只有20%，希望通过内容运营提升到40%以上。"',
    },
    finance: {
      title: "💰 金融保险示例：",
      content:
        '"我们是做理财规划的，目标客户是月收入1-3万的白领。现在有客户资源但转化率低，想通过持续的理财知识分享建立信任，最终推广我们的理财产品。"',
    },
    medical: {
      title: "🏥 医美健康示例：",
      content:
        '"我们是医美诊所，主要做轻医美项目。目标用户是25-40岁爱美女性，想通过科普内容和案例分享，让用户从了解到信任，最终预约到店体验。"',
    },
    realEstate: {
      title: "🏠 房产中介示例：",
      content:
        '"我们是房产中介，主要服务首次购房的年轻人。希望通过购房知识分享和政策解读，建立专业形象，让客户在有购房需求时第一时间想到我们。"',
    },
  },

  // 分析按钮
  analyzeButton: {
    normal: "🚀 开始分析",
    loading: "AI分析中...",
  },

  // AI 分析结果回复
  analysisResponse: (extractedInfo: any) => `我给你理了一下，看看啊：

【提取出的业务信息】
• 行业领域：${extractedInfo.industry || "未识别"}
• 产品/服务：${extractedInfo.productService || "未填写"}
• 目标受众：${extractedInfo.targetAudience || "未填写"}
• 核心优势：${extractedInfo.coreAdvantages || "未填写"}
• 用户痛点：${extractedInfo.userPainPoints || "未填写"}
• 期望行动：${extractedInfo.expectedAction || "未填写"}
• 内容条数：${extractedInfo.contentCount || "未填写"}
• 沟通风格：${extractedInfo.communicationStyle || "未填写"}

这个方向对不对？

如果没问题，右边确认一下就行。
有哪里不准确的，直接改改，然后点"确认信息"。`,

  // 字段标签
  fields: {
    industry: {
      label: "行业领域",
      placeholder: "如：在线教育、电商零售、金融理财",
    },
    productService: {
      label: "产品/服务",
      placeholder: "如：职场技能课程、母婴用品、理财规划",
    },
    targetAudience: {
      label: "目标受众",
      placeholder: "如：25-40岁职场人士、新手妈妈",
    },
    coreAdvantages: {
      label: "核心优势",
      placeholder: "如：价格亲民、专业权威、效果显著",
    },
    userPainPoints: {
      label: "用户痛点",
      placeholder: "如：时间有限、效果担忧、价格敏感",
    },
    decisionPoints: {
      label: "用户决策点",
      placeholder: "如：品牌信誉、价格对比、专业建议",
    },
    expectedAction: {
      label: "期望行动",
      placeholder: "如：购买入门课、预约咨询、推荐朋友",
    },
    contentCount: {label: "内容条数", placeholder: "如：5-8条、6-10条"},
    communicationStyle: {
      label: "沟通人设/风格",
      placeholder: "如：专业亲和、温暖可信、简洁高效",
    },
  },

  // 编辑相关
  edit: {
    editButton: "编辑",
    saveButton: "保存修改",
    cancelButton: "取消",
    confirmButton: "确认信息，生成内容序列",
    updateNotice:
      '✅ 业务信息已更新！您可以继续修改，或者点击"确认信息"进入下一步。',
    operationHint:
      '💡 请确认AI提取的信息是否准确。如需修改请点击"编辑"按钮，确认无误后点击"确认信息"进入下一步。',
  },

  // 状态标识
  status: {
    extracted: "已提取",
    aiAnalysisResult: "AI分析结果",
    notFilled: "未填写",
  },

  // 确认信息后的消息
  confirmMessage: `🎨 太好了！现在就给你搞一套内容序列

✨ 内容生成中，大概 2-3 分钟，你先去喝杯水吧嘿嘿`,

  // 内容生成完成消息
  generateCompleteMessage: (
    contentLength: number,
    contents: any[],
  ) => `🎉 搞定了！

给你整了${contentLength}条能直接用的内容：

${contents
  .map(
    (content, index) =>
      `第${index + 1}套 - ${content.title}，${content.description}`,
  )
  .join("\n")}

右边面板看看内容，
哪里不对劲直接改，
改完咱们就配置用户分层。

你说了算。`,

  // 错误信息
  error: {
    generationFailed: "抱歉，内容生成遇到了问题。请稍后重试。",
  },
};

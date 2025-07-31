// 任务详情页面文案配置
export const taskTexts = {
  // 页面操作
  navigation: {
    back: "返回",
    edit: "编辑",
    save: "保存",
    cancel: "取消",
  },

  // 任务状态
  status: {
    configured: "已配置",
    notSelected: "未选择智能体",
  },

  // 默认任务信息
  defaults: {
    taskName: "私域运营任务",
  },

  // 标签页
  tabs: {
    scenario: "智能体配置",
    content: "内容序列",
    users: "用户分层",
  },

  // 场景信息卡片
  scenario: {
    title: "智能体信息",
    fields: {
      scenarioName: "智能体名称",
      scenarioDescription: "智能体描述",
    },
  },

  // 业务信息卡片
  business: {
    title: "业务信息",
    fields: {
      industry: "行业领域",
      productService: "产品/服务",
      targetAudience: "目标受众",
      coreAdvantages: "核心优势",
    },
  },

  // 内容序列卡片
  content: {
    title: "内容序列",
    dayPrefix: "第",
    daySuffix: "天",
    sendTime: "发送时间:",
    notSet: "未设置",
    privateMessage: "私聊触达",
  },

  // 用户分层卡片
  userSegment: {
    title: "用户分层",
    newUserSOP: "新客户SOP",
    specificCondition: "特定条件分层",
    conditionLabel: "条件：",
    manualTag: "手动打标签",
  },
};

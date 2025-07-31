// 用户分层步骤文案配置
export const userSegmentTexts = {
  // 页面标题
  title: "👥 用户分层：选择目标用户群体",

  // 表单标签
  form: {
    conditionLabel: "请描述目标用户特征：",
    conditionPlaceholder: "例如：已做过产品演示的高意向用户",
    tagLabel: "将创建标签：",
    customTagLabel: "自定义标签名称：",
    customTagPlaceholder: "输入标签名称",
  },

  // 按钮文案
  buttons: {
    modify: "修改",
    createTag: "创建标签",
    confirmTag: "确认标签",
    viewTask: "查看任务",
  },

  // 新客户SOP相关
  newUserSOP: {
    name: "新客户SOP",
    tag: "新客户",
    successMessage: `✅ 搞定！新客户SOP已经给你安排上了！

你知道最头疼的是什么吗？
新加的企微好友，发个"您好"就石沉大海了。
你想跟进吧，不知道说啥；
不跟进吧，眼睁睁看着客户流失。

现在好了，系统直接帮你解决这个痛点。

每个新加的企微好友，都会自动跑这个内容流程，不用你操心，不用你记着，更不用你熬夜想文案。点击右边的"查看任务"按钮，看看完整的配置。`,
  },

  // 特定条件用户相关
  specificCondition: {
    name: "特定条件用户",
    successMessage: (tagName: string) => `✅ 系统已创建标签「${tagName}」！

💡 后续使用方法：
• 手动为符合条件的用户打上「${tagName}」标签
• 系统将自动为这些用户执行对应的跟进流程和内容
• 内容序列会按设定的时间自动发送任务

点击右边的"查看任务"按钮，查看完整的跟进配置。`,
  },

  // 配置完成状态
  completed: {
    title: "配置完成",
    newUserType: "新客户SOP",
    specificConditionType: "特定条件用户",
    conditionLabel: "条件：",
    manualTagLabel: "手动打标签",
  },

  // 默认标签生成
  defaultTagSuffix: "用户",
};

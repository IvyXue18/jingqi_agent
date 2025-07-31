// 通用UI文案配置
export const commonTexts = {
  // 通用按钮文案
  buttons: {
    confirm: "确认",
    cancel: "取消",
    save: "保存",
    edit: "编辑",
    delete: "删除",
    close: "关闭",
    back: "返回",
    next: "下一步",
    previous: "上一步",
    submit: "提交",
    reset: "重置",
    retry: "重试",
    loading: "加载中...",
    upload: "上传",
    download: "下载",
    preview: "预览",
    view: "查看",
    modify: "修改",
  },

  // 状态文案
  status: {
    loading: "加载中...",
    error: "出错了",
    success: "成功",
    warning: "警告",
    info: "提示",
    empty: "暂无数据",
    noResult: "无搜索结果",
    networkError: "网络错误",
    serverError: "服务器错误",
    timeout: "请求超时",
  },

  // 表单验证
  validation: {
    required: "必填项",
    invalid: "格式不正确",
    tooShort: "内容过短",
    tooLong: "内容过长",
    emailInvalid: "邮箱格式不正确",
    phoneInvalid: "手机号格式不正确",
    passwordWeak: "密码强度过低",
  },

  // 时间相关
  time: {
    now: "刚刚",
    minutesAgo: (n: number) => `${n}分钟前`,
    hoursAgo: (n: number) => `${n}小时前`,
    daysAgo: (n: number) => `${n}天前`,
    today: "今天",
    yesterday: "昨天",
  },

  // 文件相关
  file: {
    upload: "上传文件",
    uploadSuccess: "上传成功",
    uploadFailed: "上传失败",
    fileTooBig: "文件过大",
    fileTypeNotSupported: "文件类型不支持",
    selectFile: "选择文件",
    dragHere: "拖拽文件到此处",
  },

  // 确认对话框
  confirm: {
    deleteTitle: "确认删除",
    deleteMessage: "确定要删除吗？此操作不可恢复。",
    saveTitle: "确认保存",
    saveMessage: "确定要保存修改吗？",
    resetTitle: "确认重置",
    resetMessage: "确定要重置所有内容吗？",
  },
};

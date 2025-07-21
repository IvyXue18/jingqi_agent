import {create} from "zustand";

// 步骤类型定义
export type Step = 1 | 2 | 3 | 4;

// 消息类型定义
export interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  step?: Step;
}

// 场景类型定义
export interface Scenario {
  id: string;
  title: string;
  description: string;
  icon: string;
}

// 业务信息类型定义
export interface BusinessInfo {
  industry?: string; // 行业领域
  productService?: string; // 产品/服务
  targetAudience?: string; // 目标受众
  coreAdvantages?: string; // 核心优势
  userPainPoints?: string; // 用户痛点
  decisionPoints?: string; // 用户决策点
  expectedAction?: string; // 期望行动
  contentCount?: string; // 内容条数
  communicationStyle?: string; // 沟通人设/风格
  additionalFiles?: File[];
}

// 内容序列类型定义
export interface ContentSequence {
  id: string;
  title: string;
  description: string;
  content: string;
  order: number;
  days: number; // 第几天发送
  time: string; // 发送时间 (HH:MM:SS 格式)
  type: "private"; // 固定为私聊触达
}

// 用户分层类型定义
export interface UserSegment {
  id: string; // 分层ID
  name: string; // 分层名称
  type: "new" | "auto" | "manual"; // 分层类型：新客户/自动标签/手动标签
  criteria: string; // 分层条件
  requirements?: string[]; // 额外配置要求（如开通会话存档等）
  color: string; // 显示颜色
  tag: string; // 标签名称
}

// 分层选项类型定义
export interface SegmentOption {
  id: string; // 选项ID
  name: string; // 选项名称
  description: string; // 选项描述
  segments: UserSegment[]; // 包含的分层
}

// 应用状态接口
interface AppState {
  // 当前步骤
  currentStep: Step;

  // 聊天消息
  messages: Message[];

  // 选中的场景
  selectedScenario: Scenario | null;

  // 业务信息
  businessInfo: BusinessInfo;

  // 内容序列
  contentSequences: ContentSequence[];

  // 用户分层
  userSegments: UserSegment[];

  // Artifact 编辑状态
  isArtifactOpen: boolean;
  editingContent: ContentSequence | null;

  // 加载状态
  isLoading: boolean;
}

// 应用状态操作接口
interface AppActions {
  // 步骤操作
  setCurrentStep: (step: Step) => void;
  nextStep: () => void;
  prevStep: () => void;

  // 消息操作
  addMessage: (message: Omit<Message, "id" | "timestamp">) => void;
  clearMessages: () => void;

  // 场景操作
  setSelectedScenario: (scenario: Scenario) => void;

  // 业务信息操作
  updateBusinessInfo: (info: Partial<BusinessInfo>) => void;

  // 内容序列操作
  setContentSequences: (sequences: ContentSequence[]) => void;
  updateContentSequence: (
    id: string,
    updates: Partial<ContentSequence>,
  ) => void;

  // 用户分层操作
  setUserSegments: (segments: UserSegment[]) => void;

  // Artifact 操作
  openArtifact: (content?: ContentSequence) => void;
  closeArtifact: () => void;

  // 加载状态操作
  setLoading: (loading: boolean) => void;

  // 重置状态
  reset: () => void;
}

// 默认状态
const defaultState: AppState = {
  currentStep: 1,
  messages: [],
  selectedScenario: null,
  businessInfo: {},
  contentSequences: [],
  userSegments: [],
  isArtifactOpen: false,
  editingContent: null,
  isLoading: false,
};

// 创建store
// 禁用数据持久化（开发调试用）
export const useAppStore = create<AppState & AppActions>()((set, get) => ({
  ...defaultState,

  // 步骤操作
  setCurrentStep: (step) => set({currentStep: step}),

  nextStep: () => {
    const {currentStep} = get();
    if (currentStep < 4) {
      set({currentStep: (currentStep + 1) as Step});
    }
  },

  prevStep: () => {
    const {currentStep} = get();
    if (currentStep > 1) {
      set({currentStep: (currentStep - 1) as Step});
    }
  },

  // 消息操作
  addMessage: (message) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    set((state) => ({
      messages: [...state.messages, newMessage],
    }));
  },

  clearMessages: () => set({messages: []}),

  // 场景操作
  setSelectedScenario: (scenario) => set({selectedScenario: scenario}),

  // 业务信息操作
  updateBusinessInfo: (info) =>
    set((state) => ({
      businessInfo: {...state.businessInfo, ...info},
    })),

  // 内容序列操作
  setContentSequences: (sequences) => set({contentSequences: sequences}),

  updateContentSequence: (id, updates) =>
    set((state) => ({
      contentSequences: state.contentSequences.map((seq) =>
        seq.id === id ? {...seq, ...updates} : seq,
      ),
    })),

  // 用户分层操作
  setUserSegments: (segments) => set({userSegments: segments}),

  // Artifact 操作
  openArtifact: (content) =>
    set({
      isArtifactOpen: true,
      editingContent: content || null,
    }),

  closeArtifact: () =>
    set({
      isArtifactOpen: false,
      editingContent: null,
    }),

  // 加载状态操作
  setLoading: (loading) => set({isLoading: loading}),

  // 重置状态
  reset: () => set(defaultState),
}));

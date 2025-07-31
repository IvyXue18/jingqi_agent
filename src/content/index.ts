// 统一导出所有文案配置
export {appTexts} from "./app-texts";
export {chatTexts} from "./chat-texts";
export {stepTexts} from "./step-texts";
export {scenarioTexts} from "./scenario-texts";
export {businessTexts} from "./business-texts";
export {contentTexts} from "./content-texts";
export {userSegmentTexts} from "./user-segment-texts";
export {editorTexts} from "./editor-texts";
export {taskTexts} from "./task-texts";
export {commonTexts} from "./common-texts";

// 文案类型定义
export interface TextConfig {
  [key: string]: string | number | Function | TextConfig;
}

// 文案使用工具函数
export const getText = (
  config: TextConfig,
  path: string,
  ...args: any[]
): string => {
  const keys = path.split(".");
  let current: any = config;

  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = current[key];
    } else {
      return path; // 如果找不到，返回路径作为fallback
    }
  }

  if (typeof current === "function") {
    return current(...args);
  }

  return String(current);
};

// 使用示例：
// import { chatTexts, getText } from '@/content';
// const welcomeMsg = getText(chatTexts, 'welcomeMessage');
// const placeholder = getText(chatTexts, 'placeholders.step1');

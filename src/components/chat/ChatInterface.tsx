"use client";

import {useState, useRef, useEffect} from "react";
import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Badge} from "@/components/ui/badge";
import {Progress} from "@/components/ui/progress";
import {Send, Bot, User, RotateCcw} from "lucide-react";
import {useAppStore} from "@/lib/store";
import {StepIndicator} from "./StepIndicator";
import {MessageList} from "./MessageList";
import {ScenarioSelector} from "./steps/ScenarioSelector";
import {BusinessInfoStep} from "./steps/BusinessInfoStep";
import {ContentGenerationStep} from "./steps/ContentGenerationStep";
import {UserSegmentStep} from "./steps/UserSegmentStep";
import {ArtifactEditor} from "./ArtifactEditor";

const WELCOME_MESSAGE = {
  type: "assistant" as const,
  content:
    "嘿，朋友！\n\n客户加了不知道怎么跟进？内容写不出来？用户分不清楚？\n\n别慌，鲸奇是专门来帮你搞定这些事儿。我们 8 年的私域经验和方法论，全部浓缩在这几步了，你10分钟就能搞出一套能用的方案。\n\n关键是，这套东西真的管用。\n为啥？因为我们是用那些做私域做得好的案例和方法论训练出来的，不是瞎编的理论。说起来就是四步走：\n\n第1️⃣步：选哪个智能体，帮你干哪类活儿\n培育？邀约？发售？交付？咱一次解决一个小问题\n第2️⃣步：收集业务情况\n具体聊聊你是做什么买卖的，现在遇到啥问题，客户啥样，想达到啥效果。\n第3️⃣步：AI给你整内容\n我直接给你生成一套能用的运营内容，不用你自己憋了。不是那种花花绿绿的广告，是真正说人话、戳痛点的内容\n第4️⃣步：用户分分类\n你要跟进哪些用户，先安排清楚，后面智能体就兢兢业业给你发内容。\n\n行了废话不多说，你准备先从哪个智能体开始？右边挑一个，咱们开搞！",
  step: 1 as const,
};

export function ChatInterface() {
  const {currentStep, messages, isLoading, addMessage, nextStep, reset} =
    useAppStore();

  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isInitializedRef = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 初始化欢迎消息
  useEffect(() => {
    if (!isInitializedRef.current && messages.length === 0) {
      isInitializedRef.current = true;
      addMessage(WELCOME_MESSAGE);
    }
  }, [messages.length, addMessage]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userInput = inputValue.trim();
    addMessage({
      type: "user",
      content: userInput,
      step: currentStep,
    });

    setInputValue("");

    // 处理不同步骤的逻辑
    await handleStepLogic(userInput);
  };

  const handleStepLogic = async (userInput: string) => {
    const {
      updateBusinessInfo,
      setContentSequences,
      selectedScenario,
      setLoading,
      addMessage,
      nextStep,
    } = useAppStore.getState();

    if (currentStep === 2) {
      // 步骤2: 不应该从左侧输入，引导用户到右侧
      addMessage({
        type: "assistant",
        content: `⚠️ 请在右侧面板中填写业务信息！\n\n右侧有专门的业务描述区域和文件上传功能，填写完成后点击"🚀 开始分析"按钮即可。`,
        step: 2,
      });
    } else if (currentStep === 3) {
      // 步骤3: 如果用户有意见，可以处理内容调整
      addMessage({
        type: "assistant",
        content: `收到您的反馈！${userInput}\n\n内容序列已经生成完成，您可以在右侧面板中查看和编辑各个内容模板。\n\n现在让我们进入最后一步：配置用户分层策略，以便精准定位不同的目标用户群体。`,
        step: 3,
      });

      setTimeout(() => {
        nextStep();
      }, 1000);
    }
  };

  const handleContentGeneration = async () => {
    const {
      selectedScenario,
      setContentSequences,
      addMessage,
      setLoading,
      nextStep,
    } = useAppStore.getState();

    if (!selectedScenario) return;

    setLoading(true);

    // 添加生成中消息
    addMessage({
      type: "assistant",
      content: `终于开始了！现在就给你搞一套内容序列。大概3-5分钟吧，你先起身走走喝杯水嘿嘿`,
      step: 3,
    });

    try {
      // 模拟内容生成
      const {mockContentGeneration} = await import("@/lib/mock-data");
      const generatedContent = await mockContentGeneration(selectedScenario.id);
      setContentSequences(generatedContent);

      // 添加生成完成消息
      addMessage({
        type: "assistant",
        content: `🎉 搞定了！\n\n给你整了几条内容先看看：\n${generatedContent
          .map(
            (content, index) =>
              `【${index + 1}】第${content.days}天 - ${
                content.title
              } (私聊触达)`,
          )
          .join(
            "\n",
          )}\n\n右边面板是具体文案，\n哪里不对劲直接改，也可以再生成几条\n改完咱们就配置用户分层。\n\n你说了算。`,
        step: 3,
      });
    } catch (error) {
      addMessage({
        type: "assistant",
        content: "抱歉，内容生成遇到了问题。请稍后重试。",
        step: 3,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleReset = () => {
    isInitializedRef.current = false;
    reset();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <ScenarioSelector />;
      case 2:
        return <BusinessInfoStep />;
      case 3:
        return <ContentGenerationStep />;
      case 4:
        return <UserSegmentStep />;
      default:
        return null;
    }
  };

  return (
    <div className='w-full px-4 py-4 space-y-4'>
      {/* 步骤指示器 */}
      <StepIndicator />

      {/* 主内容区域 */}
      <div className='grid grid-cols-1 lg:grid-cols-10 gap-4'>
        {/* 聊天区域 */}
        <div className='lg:col-span-6'>
          <Card
            className='flex flex-col bg-white shadow-lg'
            style={{height: "var(--content-height)"}}>
            {/* 聊天标题 */}
            <div className='p-4 border-b bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg flex-shrink-0'>
              <div className='flex items-center gap-2'>
                <Bot className='w-5 h-5' />
                <h2 className='font-semibold'>智能助手对话</h2>
                <div className='ml-auto flex items-center gap-2'>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={handleReset}
                    className='text-white hover:bg-white/10 h-7 px-2'>
                    <RotateCcw className='w-3 h-3 mr-1' />
                    重新开始
                  </Button>
                  <Badge
                    variant='secondary'
                    className='bg-white/20 text-white'>
                    步骤 {currentStep}/4
                  </Badge>
                </div>
              </div>
            </div>

            {/* 消息列表 - 可滚动区域 */}
            <div className='flex-1 overflow-y-auto p-4 space-y-4 min-h-0'>
              <MessageList messages={messages} />
              <div ref={messagesEndRef} />
            </div>

            {/* 输入区域 */}
            <div className='p-4 border-t bg-gray-50 flex-shrink-0'>
              <div className='flex gap-2'>
                <div className='flex-1 relative'>
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={
                      currentStep === 1
                        ? "请从右边选择智能体..."
                        : currentStep === 2
                        ? "请简单描述您的业务（也可以只在右侧上传文件，或两者结合）..."
                        : currentStep === 3
                        ? "对生成的内容有什么意见吗？"
                        : "您希望如何配置用户分层？"
                    }
                    disabled={
                      isLoading || currentStep === 1 || currentStep === 2
                    }
                    className='pr-12'
                  />
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={
                    !inputValue.trim() || isLoading || currentStep === 1
                  }
                  size='icon'>
                  <Send className='w-4 h-4' />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* 步骤内容区域 */}
        <div className='lg:col-span-4'>
          <Card
            className='flex flex-col bg-white shadow-lg'
            style={{height: "var(--content-height)"}}>
            {/* 固定标题区域 */}
            <div className='p-4 border-b bg-gray-50 flex-shrink-0'>
              <h3 className='font-semibold text-gray-900'>
                {currentStep === 1 && "选择场景"}
                {currentStep === 2 && "业务描述"}
                {currentStep === 3 && "生成内容"}
                {currentStep === 4 && "设置用户"}
              </h3>
            </div>
            {/* 可滚动内容区域 */}
            <div className='flex-1 overflow-y-auto p-4 min-h-0'>
              {renderStepContent()}
            </div>
          </Card>
        </div>
      </div>

      {/* Artifact 编辑器 */}
      <ArtifactEditor />
    </div>
  );
}

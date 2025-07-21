"use client";

import {useState, useRef, useEffect} from "react";
import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Badge} from "@/components/ui/badge";
import {Progress} from "@/components/ui/progress";
import {Send, Upload, Bot, User, RotateCcw} from "lucide-react";
import {useAppStore} from "@/lib/store";
import {StepIndicator} from "./StepIndicator";
import {MessageList} from "./MessageList";
import {ScenarioSelector} from "./steps/ScenarioSelector";
import {BusinessInfoStep} from "./steps/BusinessInfoStep";
import {ContentGenerationStep} from "./steps/ContentGenerationStep";
import {UserSegmentStep} from "./steps/UserSegmentStep";
import {ArtifactEditor} from "./ArtifactEditor";

export function ChatInterface() {
  const {currentStep, messages, isLoading, addMessage, nextStep, reset} =
    useAppStore();

  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 初始化欢迎消息
  useEffect(() => {
    if (messages.length === 0) {
      addMessage({
        type: "assistant",
        content:
          "👋 您好！我是您的私域运营智能助手。\n\n我将通过4个简单的步骤，帮您创建专属的用户运营策略：\n\n1️⃣ **选择业务场景** - 告诉我您的业务类型\n2️⃣ **收集业务信息** - 了解您的具体需求\n3️⃣ **生成内容序列** - AI为您创建运营内容\n4️⃣ **配置用户分层** - 精准定位目标用户\n\n让我们开始吧！请先在右侧选择您打算在这个智能体做什么？",
        step: 1,
      });
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
      // 步骤2: 处理业务信息
      setLoading(true);

      // 模拟AI处理业务信息
      const {mockBusinessInfoExtraction} = await import("@/lib/mock-data");
      const extractedInfo = await mockBusinessInfoExtraction(userInput);
      updateBusinessInfo(extractedInfo);

      // 添加AI回复
      addMessage({
        type: "assistant",
        content: `📊 我已经分析了您的业务信息！\n\n✅ **提取结果**：\n• 行业领域：${
          extractedInfo.industry || "未识别"
        }\n• 产品/服务：${
          extractedInfo.productService || "未填写"
        }\n• 目标受众：${
          extractedInfo.targetAudience || "未填写"
        }\n• 核心优势：${
          extractedInfo.coreAdvantages || "未填写"
        }\n• 用户痛点：${
          extractedInfo.userPainPoints || "未填写"
        }\n• 期望行动：${
          extractedInfo.expectedAction || "未填写"
        }\n• 内容条数：${extractedInfo.contentCount || "未填写"}\n• 沟通风格：${
          extractedInfo.communicationStyle || "未填写"
        }\n\n请在右侧面板中详细确认这些信息是否准确。如果需要修改，您可以直接编辑，然后点击"确认信息"按钮进入下一步。`,
        step: 2,
      });

      setLoading(false);
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
      content: `🎨 正在为「${selectedScenario.title}」场景生成专属内容序列...\n\n✨ 内容生成中，请稍等片刻...`,
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
        content: `🎉 内容序列生成完成！\n\n📝 **已为您生成**：\n${generatedContent
          .map(
            (content, index) =>
              `${index + 1}. 第${content.days}天 - ${content.title} (私聊触达)`,
          )
          .join(
            "\n",
          )}\n\n您可以在右侧面板中预览和编辑这些内容。如果对内容有任何意见或需要调整，请告诉我！\n\n准备好后，我们进入最后一步：用户分层配置。`,
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
    reset();
    // 重置后添加欢迎消息
    setTimeout(() => {
      addMessage({
        type: "assistant",
        content:
          "👋 您好！我是您的私域运营智能助手。\n\n我将通过4个简单的步骤，帮您创建专属的用户运营策略：\n\n1️⃣ **选择业务场景** - 告诉我您的业务类型\n2️⃣ **收集业务信息** - 了解您的具体需求\n3️⃣ **生成内容序列** - AI为您创建运营内容\n4️⃣ **配置用户分层** - 精准定位目标用户\n\n让我们开始吧！请先在右侧选择您打算在这个智能体做什么？",
        step: 1,
      });
    }, 100);
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileNames = Array.from(files)
        .map((file) => file.name)
        .join(", ");
      addMessage({
        type: "user",
        content: `📎 已上传文件：${fileNames}`,
        step: currentStep,
      });

      // 这里可以添加实际的文件处理逻辑
      addMessage({
        type: "assistant",
        content: `收到您上传的文件：${fileNames}\n\n我已经分析了您的文件内容，请继续描述您的业务需求，我会结合文件信息为您生成更精准的运营策略。`,
        step: currentStep,
      });

      // 清除文件选择
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
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
                        ? "请从上方选择业务场景..."
                        : currentStep === 2
                        ? "请描述您的业务需求..."
                        : currentStep === 3
                        ? "对生成的内容有什么意见吗？"
                        : "您希望如何配置用户分层？"
                    }
                    disabled={isLoading || currentStep === 1}
                    className='pr-12'
                  />
                  {currentStep === 2 && (
                    <>
                      <Button
                        size='sm'
                        variant='ghost'
                        onClick={handleFileUpload}
                        className='absolute right-1 top-1 h-8 w-8 p-0'
                        title='上传文件'>
                        <Upload className='w-4 h-4' />
                      </Button>
                      <input
                        ref={fileInputRef}
                        type='file'
                        multiple
                        accept='.pdf,.doc,.docx,.txt,.md'
                        onChange={handleFileChange}
                        className='hidden'
                      />
                    </>
                  )}
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

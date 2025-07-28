"use client";

import {Card} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {
  MessageCircle,
  Edit3,
  Eye,
  Clock,
  Calendar,
  ChevronRight,
  Plus,
  CheckCircle,
} from "lucide-react";
import {useAppStore} from "@/lib/store";
import {ContentSequence} from "@/lib/store";
import {FixedBottomLayout} from "@/components/ui/fixed-bottom-layout";

export function ContentGenerationStep() {
  const {
    contentSequences,
    currentStep,
    openArtifact,
    isLoading,
    nextStep,
    addMessage,
  } = useAppStore();

  if (currentStep < 3) {
    return (
      <div className='text-center text-gray-500 py-8'>
        <div className='text-sm'>请先完成前面的步骤</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className='flex flex-col items-center justify-center py-12'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500'></div>
        <div className='mt-4 text-sm text-gray-600'>正在生成内容序列...</div>
      </div>
    );
  }

  if (contentSequences.length === 0) {
    return (
      <div className='text-center text-gray-500 py-8'>
        <div className='text-sm'>暂无生成的内容序列</div>
      </div>
    );
  }

  const formatTime = (time: string) => {
    return time.slice(0, 5); // 只显示 HH:MM
  };

  const handleEditContent = (content: ContentSequence) => {
    openArtifact(content);
  };

  const truncateText = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const handleContinueGenerate = async () => {
    const {selectedScenario, setContentSequences, setLoading} =
      useAppStore.getState();
    if (!selectedScenario) return;

    setLoading(true);
    addMessage({
      type: "assistant",
      content: "🎨 正在继续生成内容序列...\n\n✨ 请稍等片刻...",
      step: 3,
    });

    try {
      const {mockContentGeneration} = await import("@/lib/mock-data");
      const newContent = await mockContentGeneration(selectedScenario.id);

      // 调整新内容的天数，接续现有内容
      const maxDays = Math.max(...contentSequences.map((c) => c.days));
      const adjustedContent = newContent.map((content, index) => ({
        ...content,
        days: maxDays + index + 1,
        order: contentSequences.length + index + 1,
      }));

      setContentSequences([...contentSequences, ...adjustedContent]);

      addMessage({
        type: "assistant",
        content: `✅ 已为您继续生成 ${
          adjustedContent.length
        } 条内容！\n\n现在总共有 ${
          contentSequences.length + adjustedContent.length
        } 条内容，覆盖 ${
          maxDays + adjustedContent.length
        } 天。\n\n您可以继续编辑或预览内容。准备好后，点击"确认内容"进入下一步。`,
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

  const handleConfirm = () => {
    addMessage({
      type: "assistant",
      content: `🎉 内容序列搞定了！\n\n📊 最终配置：\n• 内容数量：${
        contentSequences.length
      } 条\n• 覆盖天数：${Math.max(
        ...contentSequences.map((c) => c.days),
      )} 天\n\n最后一步最关键：配置用户分层策略。\n\n你知道吗？我们服务了几百家客户，发现一个规律：\n\n转化率高的都在做两件事——\n\n第一种：对所有加过来的用户先培育筛选，把真客户和看热闹的分开。\n\n第二种：对有意向的用户进一步升单转化，把小单变大单，把观望变成交。\n\n不分层的结果是什么？好客户被当普通客户搁置，普通客户被当好客户跟进浪费时间。\n\n分层的结果呢？该培育的培育，该转化的转化，你的效率就上去了，你的转化率就翻倍了。\n\n来，看右边，咱把分层策略也配置了`,
      step: 3,
    });

    setTimeout(() => {
      nextStep();
    }, 500);
  };

  const mainContent = (
    <>
      <div className='text-center mb-6'>
        <h3 className='text-lg font-semibold text-gray-900 mb-2'>
          内容序列生成完成
        </h3>
        <p className='text-sm text-gray-600'>
          包含 {contentSequences.length} 条内容，覆盖{" "}
          {Math.max(...contentSequences.map((c) => c.days))}{" "}
          天触达，可以编辑修改
        </p>
      </div>

      <div className='space-y-3'>
        {contentSequences.map((content, index) => (
          <Card
            key={content.id}
            className='p-4 hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-blue-500'>
            {/* 头部信息 */}
            <div className='flex items-start justify-between mb-3'>
              <div className='flex items-center gap-3'>
                <div className='flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-medium text-sm'>
                  {content.days}
                </div>
                <div className='flex flex-col'>
                  <div className='flex items-center gap-2'>
                    <Calendar className='w-4 h-4 text-gray-400' />
                    <span className='text-sm text-gray-600'>
                      第 {content.days} 天
                    </span>
                    <Clock className='w-4 h-4 text-gray-400 ml-2' />
                    <span className='text-sm text-gray-600'>
                      {formatTime(content.time)}
                    </span>
                  </div>
                  <Badge
                    variant='outline'
                    className='w-fit mt-1 text-xs'>
                    <MessageCircle className='w-3 h-3 mr-1' />
                    私聊触达
                  </Badge>
                </div>
              </div>
            </div>

            {/* 标题和描述 */}
            <div className='mb-3'>
              <h4 className='font-medium text-gray-900 mb-1 line-clamp-1'>
                {content.title}
              </h4>
              <p className='text-sm text-gray-600 line-clamp-2'>
                {content.description}
              </p>
            </div>

            <Separator className='my-3' />

            {/* 内容预览 */}
            <div className='mb-3'>
              <div className='text-sm text-gray-700 bg-gray-50 p-3 rounded-md'>
                {truncateText(content.content)}
              </div>
            </div>

            {/* 操作按钮 */}
            <div className='flex items-center justify-between'>
              <div className='flex items-center text-sm text-gray-500'>
                <span>内容长度：{content.content.length} 字符</span>
              </div>
              <div className='flex items-center gap-2'>
                <Button
                  size='sm'
                  variant='outline'
                  onClick={() => handleEditContent(content)}
                  className='flex items-center gap-1'>
                  <Edit3 className='w-3 h-3' />
                  编辑
                </Button>
                <Button
                  size='sm'
                  variant='ghost'
                  onClick={() => handleEditContent(content)}
                  className='flex items-center gap-1'>
                  <Eye className='w-3 h-3' />
                  预览
                  <ChevronRight className='w-3 h-3' />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* 统计信息 */}
      <div className='mt-6 p-4 bg-blue-50 rounded-lg'>
        <div className='flex items-center justify-between text-sm'>
          <div className='text-blue-700'>
            📊 总计 {contentSequences.length} 条内容序列
          </div>
          <div className='text-blue-600'>
            📅 覆盖 {Math.max(...contentSequences.map((c) => c.days))} 天
          </div>
        </div>
      </div>
    </>
  );

  const bottomContent = (
    <div className='flex items-center justify-between gap-4'>
      <Button
        variant='outline'
        onClick={handleContinueGenerate}
        disabled={isLoading}
        className='flex-1'>
        <Plus className='w-4 h-4 mr-2' />
        继续生成内容
      </Button>
      <Button
        onClick={handleConfirm}
        disabled={isLoading}
        className='flex-1'>
        <CheckCircle className='w-4 h-4 mr-2' />
        确认内容，下一步
      </Button>
    </div>
  );

  return (
    <FixedBottomLayout bottomContent={bottomContent}>
      {mainContent}
    </FixedBottomLayout>
  );
}

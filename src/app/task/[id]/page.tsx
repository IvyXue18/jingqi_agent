"use client";

import {useEffect, useState} from "react";
import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Badge} from "@/components/ui/badge";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Textarea} from "@/components/ui/textarea";
import {Separator} from "@/components/ui/separator";
import {
  ChevronLeft,
  Save,
  Edit2,
  Calendar,
  Users,
  Target,
  CheckCircle,
  Plus,
  Trash2,
  Sparkles,
  MessageCircle,
  Edit3,
  Eye,
  Clock,
  ChevronRight,
} from "lucide-react";
import {useRouter} from "next/navigation";
import {useAppStore, ContentSequence} from "@/lib/store";
import {taskTexts} from "@/content/task-texts";
import {scenarios, contentTemplates, userSegmentOptions} from "@/lib/mock-data";

export default function TaskDetailPage({params}: {params: {id: string}}) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const {
    selectedScenario,
    contentSequences,
    userSegments,
    businessInfo,
    setContentSequences,
    openArtifact,
  } = useAppStore();

  // 使用模拟数据作为默认值
  const mockScenario = scenarios[0]; // 使用培育智能体作为默认
  const mockBusinessInfo = {
    industry: "电商零售",
    productService: "母婴用品、日用品等",
    targetAudience: "25-35岁新手妈妈",
    coreAdvantages: "品质保证、价格优惠、服务贴心",
  };
  const mockContentSequences = contentTemplates.nurture || [];
  const mockUserSegments = [
    {
      id: "new-user-segment",
      name: "新客户跟进",
      type: "new_user" as const,
      color: "#3B82F6",
      tag: "新客户",
    },
    {
      id: "vip-segment",
      name: "VIP客户分层",
      type: "specific_condition" as const,
      criteria: "购买金额 > 1000元",
      color: "#F59E0B",
      tag: "VIP客户",
    },
  ];

  const [taskData, setTaskData] = useState({
    name: taskTexts.defaults.taskName,
    description: "",
    scenario: selectedScenario || mockScenario,
    businessInfo:
      Object.keys(businessInfo).length > 0 ? businessInfo : mockBusinessInfo,
    contentSequences:
      contentSequences.length > 0 ? contentSequences : mockContentSequences,
    userSegments: userSegments.length > 0 ? userSegments : mockUserSegments,
  });

  // 同步store数据到本地状态
  useEffect(() => {
    setTaskData((prev) => ({
      ...prev,
      scenario: selectedScenario || mockScenario,
      businessInfo:
        Object.keys(businessInfo).length > 0 ? businessInfo : mockBusinessInfo,
      contentSequences:
        contentSequences.length > 0 ? contentSequences : mockContentSequences,
      userSegments: userSegments.length > 0 ? userSegments : mockUserSegments,
    }));
  }, [selectedScenario, businessInfo, contentSequences, userSegments]);

  const handleSave = () => {
    // 保存任务名称和内容序列到store
    setContentSequences(taskData.contentSequences);
    setIsEditing(false);
    // TODO: 这里可以添加实际的保存到后端的逻辑
    console.log("保存任务数据:", taskData);
  };

  const handleGenerateMore = async () => {
    setIsGenerating(true);
    try {
      // 模拟AI生成更多内容序列
      const {mockContentGeneration} = await import("@/lib/mock-data");
      const newContent = await mockContentGeneration(
        taskData.scenario?.id || "nurture",
      );

      // 调整新内容的天数，接续现有内容
      const maxDays =
        taskData.contentSequences.length > 0
          ? Math.max(...taskData.contentSequences.map((c) => c.days))
          : 0;
      const adjustedContent = newContent.map((content, index) => ({
        ...content,
        days: maxDays + index + 1,
        order: taskData.contentSequences.length + index + 1,
      }));

      setTaskData((prev) => ({
        ...prev,
        contentSequences: [...prev.contentSequences, ...adjustedContent],
      }));
    } catch (error) {
      console.error("生成内容失败:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEditContent = (content: ContentSequence) => {
    openArtifact(content);
  };

  const handleDeleteContent = (contentId: string) => {
    const updatedSequences = taskData.contentSequences.filter(
      (content) => content.id !== contentId,
    );

    // 重新排序剩余内容的天数和order
    const reorderedSequences = updatedSequences.map((content, index) => ({
      ...content,
      days: index + 1,
      order: index + 1,
    }));

    setTaskData((prev) => ({
      ...prev,
      contentSequences: reorderedSequences,
    }));
  };

  const formatTime = (time: string) => {
    return time.slice(0, 5); // 只显示 HH:MM
  };

  const truncateText = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-7xl mx-auto px-4'>
        {/* 顶部导航 */}
        <div className='flex items-center justify-between mb-6'>
          <Button
            variant='ghost'
            onClick={() => router.back()}
            className='text-gray-600'>
            <ChevronLeft className='w-4 h-4 mr-2' />
            {taskTexts.navigation.back}
          </Button>
          <div className='flex items-center gap-2'>
            {isEditing ? (
              <>
                <Button
                  variant='outline'
                  onClick={() => setIsEditing(false)}>
                  {taskTexts.navigation.cancel}
                </Button>
                <Button onClick={handleSave}>
                  <Save className='w-4 h-4 mr-2' />
                  {taskTexts.navigation.save}
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                <Edit2 className='w-4 h-4 mr-2' />
                {taskTexts.navigation.edit}
              </Button>
            )}
          </div>
        </div>

        {/* 任务标题 */}
        <Card className='mb-6 p-6'>
          <div className='flex items-start justify-between'>
            <div className='space-y-2'>
              {isEditing ? (
                <Input
                  value={taskData.name}
                  onChange={(e) =>
                    setTaskData({...taskData, name: e.target.value})
                  }
                  className='text-2xl font-bold w-[300px]'
                />
              ) : (
                <h1 className='text-2xl font-bold'>{taskData.name}</h1>
              )}
              <div className='flex items-center gap-2'>
                <Badge
                  variant='outline'
                  className='text-blue-600'>
                  {taskData.scenario?.title || taskTexts.status.notSelected}
                </Badge>
                <Badge
                  variant='outline'
                  className='text-green-600'>
                  <CheckCircle className='w-3 h-3 mr-1' />
                  {taskTexts.status.configured}
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* 任务详情 */}
        <Tabs
          defaultValue='scenario'
          className='space-y-4'>
          <TabsList>
            <TabsTrigger value='scenario'>
              <Target className='w-4 h-4 mr-2' />
              {taskTexts.tabs.scenario}
            </TabsTrigger>
            <TabsTrigger value='content'>
              <Calendar className='w-4 h-4 mr-2' />
              {taskTexts.tabs.content}
            </TabsTrigger>
            <TabsTrigger value='users'>
              <Users className='w-4 h-4 mr-2' />
              {taskTexts.tabs.users}
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value='scenario'
            className='space-y-4'>
            <Card className='p-6'>
              <h2 className='text-xl font-semibold mb-4'>
                {taskTexts.scenario.title}
              </h2>
              <div className='space-y-4'>
                <div>
                  <label className='text-sm font-medium text-gray-600'>
                    {taskTexts.scenario.fields.scenarioName}
                  </label>
                  <p className='mt-1'>{taskData.scenario?.title || "未配置"}</p>
                </div>
                <div>
                  <label className='text-sm font-medium text-gray-600'>
                    {taskTexts.scenario.fields.scenarioDescription}
                  </label>
                  <p className='mt-1'>
                    {taskData.scenario?.description || "未配置"}
                  </p>
                </div>
              </div>
            </Card>

            <Card className='p-6'>
              <h2 className='text-xl font-semibold mb-4'>
                {taskTexts.business.title}
              </h2>
              <div className='grid grid-cols-2 gap-6'>
                <div>
                  <label className='text-sm font-medium text-gray-600'>
                    {taskTexts.business.fields.industry}
                  </label>
                  <p className='mt-1'>
                    {taskData.businessInfo?.industry || "未配置"}
                  </p>
                </div>
                <div>
                  <label className='text-sm font-medium text-gray-600'>
                    {taskTexts.business.fields.productService}
                  </label>
                  <p className='mt-1'>
                    {taskData.businessInfo?.productService || "未配置"}
                  </p>
                </div>
                <div>
                  <label className='text-sm font-medium text-gray-600'>
                    {taskTexts.business.fields.targetAudience}
                  </label>
                  <p className='mt-1'>
                    {taskData.businessInfo?.targetAudience || "未配置"}
                  </p>
                </div>
                <div>
                  <label className='text-sm font-medium text-gray-600'>
                    {taskTexts.business.fields.coreAdvantages}
                  </label>
                  <p className='mt-1'>
                    {taskData.businessInfo?.coreAdvantages || "未配置"}
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent
            value='content'
            className='space-y-4'>
            <Card className='p-6'>
              <div className='flex items-center justify-between mb-6'>
                <div>
                  <h2 className='text-xl font-semibold mb-2'>
                    {taskTexts.content.title}
                  </h2>
                  <p className='text-sm text-gray-600'>
                    包含 {taskData.contentSequences.length} 条内容，覆盖{" "}
                    {taskData.contentSequences.length > 0
                      ? Math.max(
                          ...taskData.contentSequences.map((c) => c.days),
                        )
                      : 0}{" "}
                    天触达，可以编辑修改
                  </p>
                </div>
                <Button
                  onClick={handleGenerateMore}
                  disabled={isGenerating}
                  className='bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'>
                  <Plus className='w-4 h-4 mr-2' />
                  {isGenerating ? "生成中..." : "继续生成"}
                </Button>
              </div>

              <div className='space-y-4'>
                {taskData.contentSequences.length > 0 ? (
                  taskData.contentSequences.map((content) => (
                    <Card
                      key={content.id}
                      className='p-4 hover:shadow-md transition-shadow border-l-4 border-l-blue-500'>
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
                        {/* 删除按钮 */}
                        <Button
                          size='sm'
                          variant='ghost'
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteContent(content.id);
                          }}
                          className='text-red-500 hover:text-red-700 hover:bg-red-50 p-1 h-8 w-8'>
                          <Trash2 className='w-4 h-4' />
                        </Button>
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
                  ))
                ) : (
                  <div className='text-center py-12 text-gray-500'>
                    <div className='mb-4'>
                      <Calendar className='w-12 h-12 mx-auto text-gray-400 mb-4' />
                      <p className='text-lg font-medium'>暂无内容序列</p>
                      <p className='text-sm'>点击"继续生成"开始创建内容</p>
                    </div>
                    <Button
                      onClick={handleGenerateMore}
                      disabled={isGenerating}
                      className='bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'>
                      <Sparkles className='w-4 h-4 mr-2' />
                      {isGenerating ? "生成中..." : "开始生成内容"}
                    </Button>
                  </div>
                )}
              </div>

              {/* 统计信息 */}
              {taskData.contentSequences.length > 0 && (
                <div className='mt-6 p-4 bg-blue-50 rounded-lg'>
                  <div className='flex items-center justify-between text-sm'>
                    <div className='text-blue-700'>
                      📊 总计 {taskData.contentSequences.length} 条内容序列
                    </div>
                    <div className='text-blue-600'>
                      📅 覆盖{" "}
                      {Math.max(
                        ...taskData.contentSequences.map((c) => c.days),
                      )}{" "}
                      天
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent
            value='users'
            className='space-y-4'>
            <Card className='p-6'>
              <h2 className='text-xl font-semibold mb-4'>
                {taskTexts.userSegment.title}
              </h2>
              <div className='space-y-6'>
                {taskData.userSegments.length > 0 ? (
                  taskData.userSegments.map((segment) => (
                    <div
                      key={segment.id}
                      className='border rounded-lg p-4 space-y-2'>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                          <div
                            className='w-3 h-3 rounded-full'
                            style={{backgroundColor: segment.color}}
                          />
                          <h3 className='font-medium'>
                            {segment.type === "new_user"
                              ? taskTexts.userSegment.newUserSOP
                              : taskTexts.userSegment.specificCondition}
                          </h3>
                        </div>
                      </div>
                      {segment.type === "specific_condition" && (
                        <>
                          <p className='text-gray-600'>
                            {taskTexts.userSegment.conditionLabel}
                            {segment.criteria}
                          </p>
                          <div className='flex items-center gap-2'>
                            <Badge>{segment.tag}</Badge>
                            <Badge
                              variant='outline'
                              className='text-orange-600'>
                              {taskTexts.userSegment.manualTag}
                            </Badge>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                ) : (
                  <div className='text-center py-8 text-gray-500'>
                    <p>暂无用户分层配置</p>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

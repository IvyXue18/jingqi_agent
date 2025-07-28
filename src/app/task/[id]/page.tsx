"use client";

import {useEffect, useState} from "react";
import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Badge} from "@/components/ui/badge";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {
  ChevronLeft,
  Save,
  Edit2,
  Calendar,
  Users,
  Target,
  CheckCircle,
} from "lucide-react";
import {useRouter} from "next/navigation";
import {useAppStore} from "@/lib/store";

export default function TaskDetailPage({params}: {params: {id: string}}) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const {selectedScenario, contentSequences, userSegments, businessInfo} =
    useAppStore();

  const [taskData, setTaskData] = useState({
    name: "私域运营任务",
    description: "",
    scenario: selectedScenario,
    businessInfo: businessInfo,
    contentSequences: contentSequences,
    userSegments: userSegments,
  });

  const handleSave = () => {
    // TODO: 保存任务数据
    setIsEditing(false);
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
            返回
          </Button>
          <div className='flex items-center gap-2'>
            {isEditing ? (
              <>
                <Button
                  variant='outline'
                  onClick={() => setIsEditing(false)}>
                  取消
                </Button>
                <Button onClick={handleSave}>
                  <Save className='w-4 h-4 mr-2' />
                  保存
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                <Edit2 className='w-4 h-4 mr-2' />
                编辑
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
                  {taskData.scenario?.title || "未选择场景"}
                </Badge>
                <Badge
                  variant='outline'
                  className='text-green-600'>
                  <CheckCircle className='w-3 h-3 mr-1' />
                  已配置
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
              场景配置
            </TabsTrigger>
            <TabsTrigger value='content'>
              <Calendar className='w-4 h-4 mr-2' />
              内容序列
            </TabsTrigger>
            <TabsTrigger value='users'>
              <Users className='w-4 h-4 mr-2' />
              用户分层
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value='scenario'
            className='space-y-4'>
            <Card className='p-6'>
              <h2 className='text-xl font-semibold mb-4'>场景信息</h2>
              <div className='space-y-4'>
                <div>
                  <label className='text-sm font-medium text-gray-600'>
                    场景名称
                  </label>
                  <p className='mt-1'>{taskData.scenario?.title}</p>
                </div>
                <div>
                  <label className='text-sm font-medium text-gray-600'>
                    场景描述
                  </label>
                  <p className='mt-1'>{taskData.scenario?.description}</p>
                </div>
              </div>
            </Card>

            <Card className='p-6'>
              <h2 className='text-xl font-semibold mb-4'>业务信息</h2>
              <div className='grid grid-cols-2 gap-6'>
                <div>
                  <label className='text-sm font-medium text-gray-600'>
                    行业领域
                  </label>
                  <p className='mt-1'>{taskData.businessInfo?.industry}</p>
                </div>
                <div>
                  <label className='text-sm font-medium text-gray-600'>
                    产品/服务
                  </label>
                  <p className='mt-1'>
                    {taskData.businessInfo?.productService}
                  </p>
                </div>
                <div>
                  <label className='text-sm font-medium text-gray-600'>
                    目标受众
                  </label>
                  <p className='mt-1'>
                    {taskData.businessInfo?.targetAudience}
                  </p>
                </div>
                <div>
                  <label className='text-sm font-medium text-gray-600'>
                    核心优势
                  </label>
                  <p className='mt-1'>
                    {taskData.businessInfo?.coreAdvantages}
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent
            value='content'
            className='space-y-4'>
            <Card className='p-6'>
              <h2 className='text-xl font-semibold mb-4'>内容序列</h2>
              <div className='space-y-6'>
                {taskData.contentSequences.map((content, index) => (
                  <div
                    key={content.id}
                    className='border rounded-lg p-4 space-y-2'>
                    <div className='flex items-center justify-between'>
                      <h3 className='font-medium'>
                        第{content.days}天 - {content.title}
                      </h3>
                      {isEditing && (
                        <Button
                          variant='ghost'
                          size='sm'>
                          <Edit2 className='w-4 h-4' />
                        </Button>
                      )}
                    </div>
                    <p className='text-gray-600'>{content.description}</p>
                    <div className='flex items-center gap-2 text-sm text-gray-500'>
                      <Badge variant='outline'>私聊触达</Badge>
                      <span>发送时间: {content.time || "未设置"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent
            value='users'
            className='space-y-4'>
            <Card className='p-6'>
              <h2 className='text-xl font-semibold mb-4'>用户分层</h2>
              <div className='space-y-6'>
                {taskData.userSegments.map((segment) => (
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
                            ? "新客户SOP"
                            : "特定条件分层"}
                        </h3>
                      </div>
                      {isEditing && (
                        <Button
                          variant='ghost'
                          size='sm'>
                          <Edit2 className='w-4 h-4' />
                        </Button>
                      )}
                    </div>
                    {segment.type === "specific_condition" && (
                      <>
                        <p className='text-gray-600'>
                          条件：{segment.criteria}
                        </p>
                        <div className='flex items-center gap-2'>
                          <Badge>{segment.tag}</Badge>
                          <Badge
                            variant='outline'
                            className='text-orange-600'>
                            手动打标签
                          </Badge>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

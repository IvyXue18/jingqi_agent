"use client";

import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Check} from "lucide-react";
import {cn} from "@/lib/utils";
import {useAppStore} from "@/lib/store";
import {scenarios} from "@/lib/mock-data";

export function ScenarioSelector() {
  const {
    selectedScenario,
    setSelectedScenario,
    addMessage,
    nextStep,
    setLoading,
  } = useAppStore();

  const [localSelected, setLocalSelected] = useState<string | null>(
    selectedScenario?.id || null,
  );

  const handleSelectScenario = (scenarioId: string) => {
    setLocalSelected(scenarioId);
  };

  const handleConfirmSelection = async () => {
    if (!localSelected) return;

    const scenario = scenarios.find((s) => s.id === localSelected);
    if (!scenario) return;

    setLoading(true);

    // 设置选中的场景
    setSelectedScenario(scenario);

    // 添加用户选择消息
    addMessage({
      type: "user",
      content: `我选择了「${scenario.title}」场景`,
      step: 1,
    });

    // 模拟处理时间
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 添加助手回复
    addMessage({
      type: "assistant",
      content: `${scenario.title}？选得好！\n\n你知道吗，90%的人都卡在这一步。客户加了微信，然后呢？发个产品介绍就没下文了。\n\n客户心里想的是：\n"又来一个卖东西的..."\n\n你想要的是：\n让客户觉得"这家伙挺专业，有需要找他"\n\n别人是硬推销，你是软种草。\n别人发广告，你传价值。\n别人让客户烦，你让客户期待。\n\n现在，咱们得了解你的具体情况：\n\n🎯 先说说你的生意：\n- 你是什么公司？卖什么的？\n- 你的客户都是谁？老板？宝妈？还是学生？\n- 这些人现在对你了解到什么程度？刚加微信？还是已经关注一段时间了？已经买过你产品了？\n\n🚀 再说说你的目标：\n- 你希望通过这套内容达到什么效果？让客户主动咨询？还是提升品牌认知？\n\n有资料的话直接上传！我帮你分析提取关键信息，省得你打字累。也可以看下右边我给你的示例，复制过来改吧改吧。\n\n毕竟，方向对了，后面的内容才能真正戳中客户痛点，对吧？`,
      step: 2,
    });

    // 进入下一步
    nextStep();
    setLoading(false);
  };

  return (
    <div className='space-y-4'>
      <div className='text-sm text-gray-600'>
        请选择最符合您业务特点的场景类型：
      </div>

      <div className='space-y-3'>
        {scenarios.map((scenario) => {
          const isSelected = localSelected === scenario.id;
          const isConfirmed = selectedScenario?.id === scenario.id;

          return (
            <Card
              key={scenario.id}
              className={cn(
                "p-4 cursor-pointer transition-all duration-200 hover:shadow-md",
                {
                  "ring-2 ring-blue-500 bg-blue-50": isSelected && !isConfirmed,
                  "ring-2 ring-green-500 bg-green-50": isConfirmed,
                  "hover:bg-gray-50": !isSelected && !isConfirmed,
                },
              )}
              onClick={() => !isConfirmed && handleSelectScenario(scenario.id)}>
              <div className='flex items-start gap-3'>
                <div className='text-2xl flex-shrink-0 mt-1'>
                  {scenario.icon}
                </div>
                <div className='flex-1'>
                  <div className='flex items-center gap-2 mb-1'>
                    <h3 className='font-medium text-gray-900'>
                      {scenario.title}
                    </h3>
                    {isConfirmed && (
                      <Badge
                        variant='default'
                        className='bg-green-500'>
                        <Check className='w-3 h-3 mr-1' />
                        已选择
                      </Badge>
                    )}
                  </div>
                  <p className='text-sm text-gray-600 leading-relaxed'>
                    {scenario.description}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {localSelected && !selectedScenario && (
        <div className='pt-4'>
          <Button
            onClick={handleConfirmSelection}
            className='w-full'
            size='lg'>
            确认选择
          </Button>
        </div>
      )}

      {selectedScenario && (
        <div className='pt-4'>
          <div className='text-center text-sm text-green-600 bg-green-50 p-3 rounded-lg'>
            ✅ 已选择「{selectedScenario.title}」场景，请继续下一步
          </div>
        </div>
      )}
    </div>
  );
}

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
      content: `太好了！您选择了「${scenario.title}」场景。\n\n${scenario.description}\n\n现在让我们进入第二步，请告诉我：\n\n📊 **您的业务基本信息**：\n• 公司名称或品牌\n• 产品服务是什么\n• 用户群体或用户在私域中所处阶段\n• 希望这个系列内容帮您达到什么目的\n\n您也可以在输入框旁边点击上传相关的业务文档，我们会帮您分析提取关键信息。`,
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

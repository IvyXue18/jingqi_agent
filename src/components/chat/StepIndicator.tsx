"use client";

import {Check, Circle} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {cn} from "@/lib/utils";
import {useAppStore} from "@/lib/store";

const steps = [
  {id: 1, name: "选择场景", icon: "🎯"},
  {id: 2, name: "业务描述", icon: "📝"},
  {id: 3, name: "生成内容", icon: "✨"},
  {id: 4, name: "设置用户", icon: "👥"},
];

export function StepIndicator() {
  const {currentStep} = useAppStore();

  return (
    <div className='w-full max-w-2xl mx-auto mb-4'>
      <div className='flex items-center justify-between relative'>
        {/* 连接线 */}
        <div className='absolute top-4 left-0 w-full h-1 bg-gray-200 -z-10 rounded-full'>
          <div
            className='h-full bg-blue-500 transition-all duration-500 ease-in-out rounded-full'
            style={{width: `${((currentStep - 1) / 3) * 100}%`}}
          />
        </div>

        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const isUpcoming = currentStep < step.id;

          return (
            <div
              key={step.id}
              className='flex flex-col items-center'>
              {/* 步骤圆圈 */}
              <div
                className={cn(
                  "relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300",
                  {
                    "bg-blue-500 border-blue-500 text-white":
                      isCurrent || isCompleted,
                    "bg-white border-gray-300 text-gray-400": isUpcoming,
                  },
                )}>
                {isCompleted ? (
                  <Check className='w-4 h-4' />
                ) : (
                  <span className='text-sm'>{step.icon}</span>
                )}
              </div>

              {/* 步骤信息 */}
              <div className='mt-2 text-center'>
                <div
                  className={cn("text-xs font-medium transition-colors", {
                    "text-blue-600": isCurrent,
                    "text-green-600": isCompleted,
                    "text-gray-500": isUpcoming,
                  })}>
                  {step.name}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

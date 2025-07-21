"use client";

import {useState, useEffect} from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {Input} from "@/components/ui/input";
import {Badge} from "@/components/ui/badge";
import {Separator} from "@/components/ui/separator";
import {Save, X, Eye, FileText} from "lucide-react";
import {useAppStore} from "@/lib/store";

export function ArtifactEditor() {
  const {isArtifactOpen, editingContent, closeArtifact, updateContentSequence} =
    useAppStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [days, setDays] = useState(1);
  const [time, setTime] = useState("09:00:00");
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    if (editingContent) {
      setTitle(editingContent.title);
      setDescription(editingContent.description);
      setContent(editingContent.content);
      setDays(editingContent.days || 1);
      setTime(editingContent.time || "09:00:00");
      setIsPreview(false);
    }
  }, [editingContent]);

  const handleSave = () => {
    if (editingContent) {
      updateContentSequence(editingContent.id, {
        title,
        description,
        content,
        days,
        time,
      });
    }
    closeArtifact();
  };

  const handleClose = () => {
    closeArtifact();
    setTitle("");
    setDescription("");
    setContent("");
    setDays(1);
    setTime("09:00:00");
    setIsPreview(false);
  };

  const formatPreviewContent = (content: string) => {
    return content
      .replace(/^# (.*$)/gm, '<h1 class="text-xl font-bold mb-4">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-lg font-semibold mb-3">$2</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-md font-medium mb-2">$3</h3>')
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\n- (.*)/g, "\n• $1")
      .replace(/\n/g, "<br />");
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      email: "邮件",
      sms: "短信",
      push: "推送",
      social: "社交",
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      email: "bg-blue-100 text-blue-800",
      sms: "bg-green-100 text-green-800",
      push: "bg-orange-100 text-orange-800",
      social: "bg-purple-100 text-purple-800",
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  if (!editingContent) {
    return null;
  }

  return (
    <Dialog
      open={isArtifactOpen}
      onOpenChange={handleClose}>
      <DialogContent className='max-w-6xl max-h-[90vh] w-[95vw] flex flex-col'>
        <DialogHeader>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <FileText className='w-5 h-5 text-blue-600' />
              <div>
                <DialogTitle>编辑内容</DialogTitle>
                <DialogDescription>
                  修改营销内容的标题、描述和正文
                </DialogDescription>
              </div>
            </div>
            <Badge
              className={getTypeColor(editingContent.type)}
              variant='secondary'>
              {getTypeLabel(editingContent.type)}
            </Badge>
          </div>
        </DialogHeader>

        <div className='flex-1 min-h-0 flex flex-col gap-4'>
          {/* 操作按钮 */}
          <div className='flex gap-2'>
            <Button
              variant={isPreview ? "outline" : "default"}
              size='sm'
              onClick={() => setIsPreview(false)}>
              编辑
            </Button>
            <Button
              variant={isPreview ? "default" : "outline"}
              size='sm'
              onClick={() => setIsPreview(true)}>
              <Eye className='w-4 h-4 mr-1' />
              预览
            </Button>
          </div>

          <Separator />

          {!isPreview ? (
            /* 编辑模式 */
            <div className='flex-1 space-y-4 overflow-y-auto'>
              <div>
                <label className='text-sm font-medium text-gray-700 mb-2 block'>
                  标题
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder='输入内容标题'
                />
              </div>

              <div>
                <label className='text-sm font-medium text-gray-700 mb-2 block'>
                  描述
                </label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder='输入内容描述'
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='text-sm font-medium text-gray-700 mb-2 block'>
                    发送天数
                  </label>
                  <Input
                    type='number'
                    min='1'
                    max='365'
                    value={days}
                    onChange={(e) => setDays(parseInt(e.target.value) || 1)}
                    placeholder='第几天发送'
                  />
                </div>

                <div>
                  <label className='text-sm font-medium text-gray-700 mb-2 block'>
                    发送时间
                  </label>
                  <Input
                    type='time'
                    value={time.slice(0, 5)} // 只显示 HH:MM
                    onChange={(e) => setTime(e.target.value + ":00")} // 添加秒数
                    placeholder='发送时间'
                  />
                </div>
              </div>

              <div className='flex-1 flex flex-col'>
                <label className='text-sm font-medium text-gray-700 mb-2 block'>
                  正文内容
                </label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder='输入正文内容，支持Markdown格式'
                  className='flex-1 min-h-[300px] resize-none font-mono text-sm'
                />
              </div>
            </div>
          ) : (
            /* 预览模式 */
            <div className='flex-1 overflow-y-auto'>
              <div className='bg-white border rounded-lg p-6'>
                <div className='space-y-4'>
                  <div>
                    <h3 className='text-lg font-semibold text-gray-900 mb-1'>
                      {title || editingContent.title}
                    </h3>
                    <p className='text-gray-600 text-sm'>
                      {description || editingContent.description}
                    </p>
                    <div className='flex items-center gap-4 mt-2 text-xs text-gray-500'>
                      <span>📅 第 {days} 天</span>
                      <span>🕒 {time.slice(0, 5)}</span>
                      <span>💬 私聊触达</span>
                    </div>
                  </div>

                  <Separator />

                  <div
                    className='prose prose-sm max-w-none text-gray-800 leading-relaxed'
                    dangerouslySetInnerHTML={{
                      __html: formatPreviewContent(
                        content || editingContent.content,
                      ),
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 底部操作按钮 */}
          <Separator />
          <div className='flex justify-end gap-2'>
            <Button
              variant='outline'
              onClick={handleClose}>
              <X className='w-4 h-4 mr-1' />
              取消
            </Button>
            <Button onClick={handleSave}>
              <Save className='w-4 h-4 mr-1' />
              保存修改
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

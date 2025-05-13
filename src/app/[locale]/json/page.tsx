"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Download, AlertCircle, Trash } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Toaster, toast } from "sonner";
import { useTranslations } from "next-intl";

// 定义JSON数据类型
type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
interface JsonObject { [key: string]: JsonValue }
type JsonArray = JsonValue[];

export default function JsonFormatter() {
  const [jsonInput, setJsonInput] = useState<string>("");
  const [jsonOutput, setJsonOutput] = useState<string>("");
  const [jsonTree, setJsonTree] = useState<JsonValue | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [indentSize] = useState<number>(2);
  const t = useTranslations("Json");

  // 示例JSON
  const jsonExample = `{
  "name": "JSON格式化工具",
  "version": "1.0.0",
  "description": "一个优雅的在线JSON格式化与验证工具",
  "features": [
    "格式化",
    "验证",
    "树状显示"
  ],
  "isAwesome": true,
  "stats": {
    "users": 10000,
    "operations": 50000
  }
}`;

  // 格式化JSON
  const handleFormat = useCallback((input = jsonInput) => {
    try {
      if (!input.trim()) {
        setJsonOutput("");
        setJsonTree(null);
        setError(null);
        return;
      }

      // 解析JSON
      const parsed = JSON.parse(input);

      // 格式化输出
      const formatted = JSON.stringify(parsed, null, indentSize);

      setJsonOutput(formatted);
      setJsonTree(parsed);
      setError(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      setError(`JSON解析错误: ${errorMessage}`);
      toast.error(`JSON解析错误: ${errorMessage}`);
      setJsonTree(null);
    }
  }, [jsonInput, indentSize]);

  useEffect(() => {
    // 初始加载示例
    handleFormat(jsonExample);
  }, [jsonExample, handleFormat]);

  // 复制到剪贴板
  const handleCopy = () => {
    if (!jsonOutput) {
      toast.error("没有可复制的内容");
      return;
    }

    navigator.clipboard.writeText(jsonOutput);
    toast.success("已复制到剪贴板", {
      description: "JSON内容已复制成功"
    });
  };

  // 下载JSON文件
  const handleDownload = () => {
    if (!jsonOutput) {
      toast.error("没有可下载的内容");
      return;
    }

    const blob = new Blob([jsonOutput], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "formatted-json.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 清空内容
  const handleClear = () => {
    setJsonInput("");
    setJsonOutput("");
    setJsonTree(null);
    setError(null);
  };

  // 用户输入变化时自动格式化
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = e.target.value;
    setJsonInput(input);

    // 尝试自动格式化
    if (input.trim()) {
      try {
        const parsed = JSON.parse(input);
        const formatted = JSON.stringify(parsed, null, indentSize);
        setJsonOutput(formatted);
        setJsonTree(parsed);
        setError(null);
      } catch {
        // 仅在用户停止输入后显示错误
        setError(null); // 先清除错误，避免用户输入过程中频繁显示错误
      }
    } else {
      setJsonOutput("");
      setJsonTree(null);
      setError(null);
    }
  };

  // 延迟验证
  useEffect(() => {
    // 500ms后验证JSON，以避免在用户快速输入时显示错误
    const timer = setTimeout(() => {
      if (jsonInput.trim()) {
        try {
          JSON.parse(jsonInput);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : '未知错误';
          setError(`JSON解析错误: ${errorMessage}`);
        }
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [jsonInput]);

  // 渲染JSON树视图
  const renderJsonTree = (data: JsonValue, path: string = "$", isExpanded: boolean = true) => {
    if (data === null) return <span className="text-blue-600">null</span>;

    if (typeof data !== "object") {
      if (typeof data === "string")
        return <span className="text-green-600">&quot;{data}&quot;</span>;
      if (typeof data === "number" || typeof data === "boolean")
        return <span className="text-blue-600">{String(data)}</span>;
      return <span>{String(data)}</span>;
    }

    if (Array.isArray(data)) {
      return (
        <Accordion type="multiple" defaultValue={isExpanded ? [path] : []} className="w-full">
          <AccordionItem value={path}>
            <AccordionTrigger className="text-left py-1 hover:no-underline">
              <span className="text-orange-500">Array</span>
              <span className="text-gray-500 ml-2">[{data.length}]</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="ml-6 border-l-2 border-dashed border-gray-300 pl-4">
                {data.map((item, index) => (
                  <div key={index} className="mb-1">
                    <span className="text-gray-500 mr-2">[{index}]:</span>
                    {renderJsonTree(item, `${path}[${index}]`, isExpanded)}
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      );
    }

    // 对象
    return (
      <Accordion type="multiple" defaultValue={isExpanded ? [path] : []} className="w-full">
        <AccordionItem value={path}>
          <AccordionTrigger className="text-left py-1 hover:no-underline">
            <span className="text-orange-500">Object</span>
            <span className="text-gray-500 ml-2">{`{${Object.keys(data).length}}`}</span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="ml-6 border-l-2 border-dashed border-gray-300 pl-4">
              {Object.entries(data).map(([key, value], index) => (
                <div key={index} className="mb-1">
                  <span className="text-purple-600 mr-2">&quot;{key}&quot;:</span>
                  {renderJsonTree(value, `${path}.${key}`, isExpanded)}
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-background text-foreground">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">{t("title")}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t("sub_title")}
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 输入面板 */}
          <Card className="shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="flex justify-between items-center">
                <span>{t("input")}</span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClear}
                  >
                    <Trash className="h-4 w-4 mr-1" /> {t("clear")}
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
              {t("input_describe")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                className="font-mono h-96 resize-none bg-background"
                placeholder={t("input")}
                value={jsonInput}
                onChange={handleInputChange}
              />
            </CardContent>
          </Card>

          {/* 输出面板 */}
          <Card className="shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="flex justify-between items-center">
                <span>{t("result")}</span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    disabled={!jsonOutput}
                  >
                    <Copy className="h-4 w-4 mr-1" /> {t("copy")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    disabled={!jsonOutput}
                  >
                    <Download className="h-4 w-4 mr-1" /> {t("download")}
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                <span>{t("result_describe")}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error ? (
                <div className="h-96 overflow-auto flex items-center justify-center">
                  <div className="bg-destructive/10 text-destructive p-6 rounded-lg max-w-lg text-center">
                    <AlertCircle className="h-6 w-6 mx-auto mb-2" />
                    <h3 className="font-medium text-lg mb-1">错误</h3>
                    <p>{error}</p>
                  </div>
                </div>
              ) : (
                <div className="h-96 overflow-auto">
                  <div className="rounded-md p-4 h-full bg-muted/50">
                    {jsonTree ? renderJsonTree(jsonTree) : "无数据可显示"}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* FAQ部分 */}
        <div className="mt-12 p-6 rounded-lg bg-card text-card-foreground shadow-lg">
          <h2 className="text-2xl font-bold mb-6">{t("faq")}</h2>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>{t("faq_introduce")}</AccordionTrigger>
              <AccordionContent>
                <p className="mb-3">{t("faq_introduce_content_1")}</p>
                <p>{t("faq_introduce_content_2")}</p>
                <ul className="list-disc list-inside my-3 ml-2 space-y-1">
                  <li>{t("faq_introduce_content_3")}</li>
                  <li>{t("faq_introduce_content_4")}</li>
                </ul>
                <p>{t("faq_introduce_content_5")}</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>{t("faq_grammar")}</AccordionTrigger>
              <AccordionContent>
                <p className="mb-3">{t("faq_grammar_content_1")}</p>
                <ul className="list-disc list-inside my-3 ml-2 space-y-1">
                  <li>{t("faq_grammar_content_2")}</li>
                  <li>{t("faq_grammar_content_3")}</li>
                  <li>{t("faq_grammar_content_4")}</li>
                  <li>{t("faq_grammar_content_5")}</li>
                </ul>
                <p className="mb-3">{t("faq_grammar_content_6")}</p>
                <ul className="list-disc list-inside my-3 ml-2 space-y-1">
                  <li>{t("faq_grammar_content_7")}</li>
                  <li></li>{t("faq_grammar_content_8")}
                  <li>{t("faq_grammar_content_9")}</li>
                  <li>{t("faq_grammar_content_10")}</li>
                  <li>{t("faq_grammar_content_11")}</li>
                  <li>{t("faq_grammar_content_12")}</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>{t("faq_xml")}</AccordionTrigger>
              <AccordionContent>
                <p className="mb-3">{t("faq_xml_content_1")}</p>
                <ul className="list-disc list-inside my-3 ml-2 space-y-2">
                  <li>{t("faq_xml_content_2")}</li>
                  <li>{t("faq_xml_content_3")}</li>
                  <li>{t("faq_xml_content_4")}</li>
                  <li>{t("faq_xml_content_5")}</li>
                </ul>
                <p className="mb-3">{t("faq_xml_content_6")}</p>
                <ul className="list-disc list-inside my-3 ml-2 space-y-2">
                  <li>{t("faq_xml_content_7")}</li>
                  <li>{t("faq_xml_content_8")}</li>
                  <li>{t("faq_xml_content_9")}</li>
                  <li>{t("faq_xml_content_10")}</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>{t("faq_scene")}</AccordionTrigger>
              <AccordionContent>
                <p className="mb-3">{t("faq_scene_content_1")}</p>
                <ul className="list-disc list-inside my-3 ml-2 space-y-2">
                  <li>{t("faq_scene_content_2")}</li>
                  <li>{t("faq_scene_content_3")}</li>
                  <li>{t("faq_scene_content_4")}</li>
                  <li>{t("faq_scene_content_5")}</li>
                  <li>{t("faq_scene_content_6")}</li>
                  <li>{t("faq_scene_content_7")}</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>{t("faq_demo")}</AccordionTrigger>
              <AccordionContent>
                <p className="mb-3">{t("faq_demo_content_1")}</p>
                <pre className="p-3 rounded my-2 text-sm overflow-x-auto bg-muted/50">
                  {`{
  "name": "mike",
  "age": 30,
  "isStudent": false,
  "address": {
    "city": "new york",
    "zipcode": "100000"
  },
  "phoneNumbers": [
    "123-456-7890",
    "987-654-3210"
  ],
  "spouse": null
}`}
                </pre>
                <p className="mb-3">JSON数组示例：</p>
                <pre className="p-3 rounded my-2 text-sm overflow-x-auto bg-muted/50">
                  {`[
  {
    "id": 1,
    "name": "A",
    "price": 99.99
  },
  {
    "id": 2,
    "name": "B",
    "price": 199.99
  },
  {
    "id": 3,
    "name": "C",
    "price": 299.99
  }
]`}
                </pre>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      <Toaster position="top-center" richColors />
    </div>
  );
} 
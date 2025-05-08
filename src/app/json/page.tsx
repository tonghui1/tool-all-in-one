"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Download, AlertCircle, Trash, FileCode } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Toaster, toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function JsonFormatter() {
  const [jsonInput, setJsonInput] = useState<string>("");
  const [jsonOutput, setJsonOutput] = useState<string>("");
  const [jsonTree, setJsonTree] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [indentSize] = useState<number>(2); // 保留状态但移除UI控制
  const [darkTheme, setDarkTheme] = useState<boolean>(false);

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

  useEffect(() => {
    // 初始加载示例
    handleFormat(jsonExample);
  }, []);

  // 格式化JSON
  const handleFormat = (input = jsonInput) => {
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
    } catch (err: any) {
      setError(`JSON解析错误: ${err.message}`);
      toast.error(`JSON解析错误: ${err.message}`);
      setJsonTree(null);
    }
  };

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
      } catch (err) {
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
        } catch (err: any) {
          setError(`JSON解析错误: ${err.message}`);
        }
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [jsonInput]);

  // 渲染JSON树视图 - 修改为自动展开所有节点
  const renderJsonTree = (data: any, path: string = "$", isExpanded: boolean = true) => {
    if (data === null) return <span className="text-blue-600">null</span>;

    if (typeof data !== "object") {
      if (typeof data === "string")
        return <span className="text-green-600">"{data}"</span>;
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
                  <span className="text-purple-600 mr-2">"{key}":</span>
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
          <h1 className="text-4xl font-bold mb-2">JSON格式化与验证工具</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            一个在线格式化、验证和查看JSON数据的工具
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 输入面板 */}
          <Card className="shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="flex justify-between items-center">
                <span>JSON输入</span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClear}
                  >
                    <Trash className="h-4 w-4 mr-1" /> 清空
                  </Button>
                  <div className="hidden sm:flex items-center gap-2 text-sm">
                    <span>暗黑模式</span>
                    <Switch
                      checked={darkTheme}
                      onCheckedChange={setDarkTheme}
                    />
                  </div>
                </div>
              </CardTitle>
              <CardDescription>
                请输入或粘贴JSON数据进行格式化和验证
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                className="font-mono h-96 resize-none bg-background"
                placeholder="在此输入JSON..."
                value={jsonInput}
                onChange={handleInputChange}
              />
            </CardContent>
          </Card>

          {/* 输出面板 */}
          <Card className="shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="flex justify-between items-center">
                <span>格式化结果</span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    disabled={!jsonOutput}
                  >
                    <Copy className="h-4 w-4 mr-1" /> 复制
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    disabled={!jsonOutput}
                  >
                    <Download className="h-4 w-4 mr-1" /> 下载
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                <span>树状展示JSON结构</span>
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
          <h2 className="text-2xl font-bold mb-6">什么是JSON?</h2>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>JSON介绍</AccordionTrigger>
              <AccordionContent>
                <p className="mb-3">JSON (JavaScript Object Notation) 是一种轻量级的数据交换格式。它基于JavaScript语言的一个子集，但是它是完全独立于语言的文本格式。这些特性使JSON成为理想的数据交换语言。</p>
                <p>JSON易于人阅读和编写，同时也易于机器解析和生成。它基于两种结构：</p>
                <ul className="list-disc list-inside my-3 ml-2 space-y-1">
                  <li>键值对的集合（对象）</li>
                  <li>值的有序列表（数组）</li>
                </ul>
                <p>由于这些通用的数据结构，几乎所有现代编程语言都支持JSON格式的数据。</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>JSON语法规则</AccordionTrigger>
              <AccordionContent>
                <p className="mb-3">JSON语法是JavaScript语法的子集，规则非常简单：</p>
                <ul className="list-disc list-inside my-3 ml-2 space-y-1">
                  <li>数据在名称/值对中</li>
                  <li>数据由逗号分隔</li>
                  <li>大括号 <code className="bg-muted px-1 rounded">{ }</code> 保存对象</li>
                  <li>方括号 <code className="bg-muted px-1 rounded">[]</code> 保存数组</li>
                </ul>
                <p className="mb-3">JSON值可以是：</p>
                <ul className="list-disc list-inside my-3 ml-2 space-y-1">
                  <li>数字（整数或浮点数）</li>
                  <li>字符串（在双引号中）</li>
                  <li>布尔值（true 或 false）</li>
                  <li>数组（在方括号中）</li>
                  <li>对象（在大括号中）</li>
                  <li>null</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>JSON与XML对比</AccordionTrigger>
              <AccordionContent>
                <p className="mb-3">与XML相比，JSON具有以下优势：</p>
                <ul className="list-disc list-inside my-3 ml-2 space-y-2">
                  <li>语法更简洁，文件体积通常更小</li>
                  <li>解析速度更快</li>
                  <li>使用数组表示有序集合</li>
                  <li>可以使用现有的JavaScript函数直接解析，不需要DOM</li>
                </ul>
                <p className="mb-3">XML的优势包括：</p>
                <ul className="list-disc list-inside my-3 ml-2 space-y-2">
                  <li>支持注释</li>
                  <li>具有命名空间</li>
                  <li>可以使用XPath和XSLT</li>
                  <li>更成熟的架构验证能力</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>JSON的常见使用场景</AccordionTrigger>
              <AccordionContent>
                <p className="mb-3">JSON广泛应用于多种场景：</p>
                <ul className="list-disc list-inside my-3 ml-2 space-y-2">
                  <li><strong>Web API通信</strong>：大多数RESTful API使用JSON作为数据交换格式</li>
                  <li><strong>配置文件</strong>：许多应用程序使用JSON文件存储配置信息</li>
                  <li><strong>数据存储</strong>：NoSQL数据库如MongoDB使用类JSON格式存储数据</li>
                  <li><strong>前后端数据交换</strong>：浏览器与服务器之间的数据传输</li>
                  <li><strong>序列化与反序列化</strong>：将内存中的对象转换为可存储或可传输的格式</li>
                  <li><strong>构建时优化</strong>：静态网站生成器使用JSON存储内容</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>JSON基本语法示例</AccordionTrigger>
              <AccordionContent>
                <p className="mb-3">简单的JSON对象：</p>
                <pre className="p-3 rounded my-2 text-sm overflow-x-auto bg-muted/50">
                  {`{
  "name": "张三",
  "age": 30,
  "isStudent": false,
  "address": {
    "city": "北京",
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
    "name": "产品A",
    "price": 99.99
  },
  {
    "id": 2,
    "name": "产品B",
    "price": 199.99
  },
  {
    "id": 3,
    "name": "产品C",
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
"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { defaultLanguage, getLanguagePreference, saveLanguagePreference } from '@/lib/language';

// 定义语言上下文类型
interface LanguageContextType {
  language: string;
  setLanguage: (langCode: string) => void;
}

// 创建语言上下文
const LanguageContext = createContext<LanguageContextType>({
  language: defaultLanguage,
  setLanguage: () => {}
});

// 提供语言上下文的组件
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<string>(defaultLanguage);
  
  // 初始化时从localStorage加载语言设置
  useEffect(() => {
    const savedLanguage = getLanguagePreference();
    setLanguageState(savedLanguage);
    document.documentElement.lang = savedLanguage.split('-')[0];
  }, []);
  
  // 切换语言
  const setLanguage = (langCode: string) => {
    setLanguageState(langCode);
    saveLanguagePreference(langCode);
    document.documentElement.lang = langCode.split('-')[0];
    
    // 当语言改变时触发自定义事件，让其他组件可以响应
    window.dispatchEvent(new CustomEvent('languageChange', { detail: { language: langCode } }));
  };
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

// 自定义hook，方便使用语言上下文
export function useLanguage() {
  return useContext(LanguageContext);
} 
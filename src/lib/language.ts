// 支持的语言列表
export const languages = [
  { code: 'zh-CN', name: '简体中文' },
  { code: 'en-US', name: 'English' },
  { code: 'ja-JP', name: '日本語' },
  { code: 'ko-KR', name: '한국어' },
  { code: 'fr-FR', name: 'Français' },
  { code: 'de-DE', name: 'Deutsch' },
  { code: 'es-ES', name: 'Español' },
  { code: 'ru-RU', name: 'Русский' }
];

// 默认语言
export const defaultLanguage = 'zh-CN';

// 保存语言选择到本地存储
export const saveLanguagePreference = (langCode: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('preferredLanguage', langCode);
  }
};

// 获取保存的语言选择，如果没有则返回默认语言
export const getLanguagePreference = (): string => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('preferredLanguage');
    if (saved && languages.some(lang => lang.code === saved)) {
      return saved;
    }
  }
  return defaultLanguage;
};

// 获取语言名称
export const getLanguageName = (code: string): string => {
  const language = languages.find(lang => lang.code === code);
  return language ? language.name : '简体中文';
}; 
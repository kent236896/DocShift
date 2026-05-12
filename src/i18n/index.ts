import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import en from './en.json';
import zh from './zh.locale';
const detectLanguage = (): 'en' | 'zh' => navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en';
void i18n.use(initReactI18next).init({ resources: { en: { translation: en }, zh: { translation: zh } }, lng: detectLanguage(), fallbackLng: 'en', interpolation: { escapeValue: false } });
export { useTranslation };
export default i18n;

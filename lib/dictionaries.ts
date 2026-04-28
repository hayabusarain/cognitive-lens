const dictionaries = {
  ja: () => import('@/dictionaries/ja.json').then((module) => module.default),
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
  ko: () => import('@/dictionaries/ko.json').then((module) => module.default),
};

export const getDictionary = async (locale: 'ja' | 'en' | 'ko') => {
  return dictionaries[locale] ? dictionaries[locale]() : dictionaries.ja();
};

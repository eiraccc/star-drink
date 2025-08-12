import pinyin from 'pinyin';
import slugify from 'slugify';
import { ShopNameSlugType } from '../src/types/shop';

function toPinyin(text: string): string {
  // 將中文轉拼音（空格合併，轉小寫）
  const pyArray = pinyin(text, { style: pinyin.STYLE_NORMAL });
  return pyArray.flat().join(' ').toLowerCase();
}

export const generateSlug = (input: string):ShopNameSlugType => {
  const isPureEnglish = /^[a-zA-Z\s]+$/.test(input);
  const name = isPureEnglish ? input : toPinyin(input);
  const slug = slugify(name, { lower: true, strict: true });

  return {
    nameEn: isPureEnglish ? input : '',
    nameZh: !isPureEnglish ? input : '',
    slug: slugify(name, { lower: true, strict: true }),
    alias: [input, name, slug]
  }
}
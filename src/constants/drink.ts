import { SugarLevel, IceLevel } from '../types/drinkReview';

export const sugerLevels: SugarLevel[] = [0, 25, 50, 75, 100];
export const iceLevels: IceLevel[] = [-1, 0, 30, 70, 100];

export const sugarLabelMap: Record<number, string> = {
    0: 'No Sugar',
    25: 'Light Sugar',
    50: 'Half Sugar',
    75: 'Less Sugar',
    100: 'Regular Sugar',
  };
  
export const iceLabelMap: Record<number, string> = {
  [-1]: 'Hot 🔥',
  0: 'No Ice',
  30: 'Light Ice',
  70: 'Less Ice',
  100: 'Regular Ice',
};

export type OptionType = {
    value: number,
    label: string,
    opacity: number,
    type: 'sugar' | 'ice'
}

export const sugarOptions:OptionType[] = sugerLevels.map((level, index) => ({
    value: level,
    label: sugarLabelMap[level].replace(' ', '\n'),
    opacity: (index + 1) * 20,
    type: 'sugar'
}));

export const iceOptions:OptionType[] = iceLevels.map((level, index) => ({
    value: level,
    label: iceLabelMap[level].replace(' ', '\n'),
    opacity: (index + 1) * 20,
    type: 'ice'
}));

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

export const sugarOptions = sugerLevels.map(level => ({
    value: level,
    label: sugarLabelMap[level].replace(' ', '\n')
}));

export const iceOptions = iceLevels.map(level => ({
    value: level,
    label: iceLabelMap[level].replace(' ', '\n')
}));

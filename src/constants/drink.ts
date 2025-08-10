import { SugarLevel, IceLevel, ToppingType } from '../types/drinkReview';
import { simpleLabelType } from '../component/MultiSelect';

export const sugarLevels: SugarLevel[] = [0, 25, 50, 75, 100];
export const iceLevels: IceLevel[] = [-1, 0, 30, 70, 100];

export const sugarLabelMap: Record<SugarLevel, string> = {
    0: 'No Sugar',
    25: 'Light Sugar',
    50: 'Half Sugar',
    75: 'Less Sugar',
    100: 'Regular Sugar',
  };
  
export const iceLabelMap: Record<IceLevel, string> = {
  [-1]: 'Hot 🔥',
  0: 'No Ice',
  30: 'Light Ice',
  70: 'Less Ice',
  100: 'Regular Ice',
};

export type SugarIceLabelType = 
    | {
        type: 'ice';
        value: IceLevel;
        label: string;
        opacity?: number;
      }
    | {
        type: 'sugar';
        value: SugarLevel;
        label: string;
        opacity?: number;
      };;

export const sugarOptions:SugarIceLabelType[] = sugarLevels.map((level, index) => ({
    value: level as SugarLevel,
    label: sugarLabelMap[level].replace(/ /g, '\n'),
    opacity: (index + 1) * 20,
    type: 'sugar'
}));

export const iceOptions:SugarIceLabelType[] = iceLevels.map((level, index) => ({
    value: level as IceLevel,
    label: iceLabelMap[level].replace(/ /g, '\n'),
    opacity: (index + 1) * 20,
    type: 'ice'
}));

type TagColorConfig = {
  text: string;
  bg: (opacity?: number) => string;
};

type TagType = 'sugar' | 'ice';

export const tagColorMap: Record<TagType, TagColorConfig> = {
    sugar: {
        text: 'var(--color-text-sugar)',
        bg: (opacity = 1) => `rgb(var(--color-primary-sugar-rgb) / ${opacity})`,
    },
    ice: {
        text: 'var(--color-text-ice)',
        bg: (opacity = 1) => `rgb(var(--color-primary-ice-rgb) / ${opacity})`,
    }
};

const toppings: ToppingType[] = [
    'boba',
    'pudding',
    'brown-sugar-boba',
    'grass-jelly',
    'aloe-vera',
    'red-Bean',
    'popping-boba'
];


// Convert a kebab-case string (e.g. "red-bean") to Title Case (e.g. "Red Bean")
function kebabToTitleCase(input: string): string {
  return input
    .split('-') // Split the string by "-" to get each word
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
    .join(' '); // Join the words with a space
};

export const toppingOptions:simpleLabelType[] = toppings.map(topping => ({
    value: topping.trim().toLowerCase().replace(/\s+/g, '-'),
    label: kebabToTitleCase(topping)
}));


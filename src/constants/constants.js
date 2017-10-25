let env = 'dev';
if (process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'production') {
  env = 'prod';
} else if (process.env.NODE_ENV === 'local') {
  env = 'local';
} else if (process.env.NODE_ENV === 'test') {
  env = 'test';
}

const baseUrls = {
  prod: 'https://20170808t142850-dot-forward-chess-157313.appspot.com',
  dev: 'https://forward-chess-157313.appspot.com',
  test: 'https://20170919t201545-dot-forward-chess-157313.appspot.com',
  local: 'http://localhost:8080'
};

export const BASE_API =  baseUrls[env];

// do not modify these -these constants are as observed in the universe
export const MILISECONDS_TO_SECONDS = 1000.0;

export const WEEK_LENGTH = 7;
export const DAYS_OF_WEEK = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

export const UNASSIGNED_SHIFTS = 'unassigned-shifts';
export const DEFAULT_TEAM_JOB_COLOR = '673AB7';
export const NEW_JOB_UUID = 'NEW_JOB_UUID';
export const DEFAULT_NEW_JOB = {
  uuid: NEW_JOB_UUID,
  name: '',
  color: DEFAULT_TEAM_JOB_COLOR,
  isVisible: false,
};
export const COLOR_PICKER_COLORS = [
  '#F44336',
  '#E91E63',
  '#673AB7',
  '#3F51B5',
  '#2196F3',
  '#00BCD4',
  '#009688',
  '#4CAF50',
  '#FFC107',
  '#FF9800',
];

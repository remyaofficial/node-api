import { Seed } from '../core/modules/seeder/seeder.dto';

const seed: Seed = {
  model: 'Setting',
  action: 'once',
  data: [
    {
      name: 'setting_1',
      display_name: 'Setting 1',
      value: 'value 1',
    },
    {
      name: 'setting_2',
      display_name: 'Setting 2',
      value: 'value 2',
    },
  ],
};

export default seed;

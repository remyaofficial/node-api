import { Seed } from '../core/modules/seeder/seeder.dto';

const seed: Seed = {
  model: 'Role',
  action: 'once',
  data: [
    {
      name: 'Admin',
    },
    {
      name: 'User',
    },
  ],
};

export default seed;

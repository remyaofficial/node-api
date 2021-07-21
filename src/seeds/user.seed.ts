import { Seed, SeedReference } from '../core/modules/seeder/seeder.dto';

const seed: Seed = {
  model: 'User',
  action: 'once',
  data: [
    {
      role_id: new SeedReference({
        model: 'Role',
        where: {
          name: 'Admin',
        },
      }),
      first_name: 'Super',
      last_name: 'Admin',
      email: 'admin@admin.com',
      phone_code: '+1',
      phone: '9999999999',
      password: '123456',
    },
    {
      role_id: new SeedReference({
        model: 'Role',
        where: {
          name: 'User',
        },
      }),
      first_name: 'Test',
      last_name: 'User',
      email: 'user@user.com',
      phone_code: '+1',
      phone: '9999999998',
      password: '123456',
    },
  ],
};

export default seed;

import { Seed } from '../core/modules/seeder/seeder.dto';
import roleSeed from './role.seed';
import userSeed from './user.seed';
import settingSeed from './setting.seed';
import pageSeed from './page.seed';
import countrySeed from './country.seed';
import stateSeed from './state.seed';
import templateSeed from './template.seed';

const seeds: Seed[] = [
  roleSeed,
  userSeed,
  settingSeed,
  pageSeed,
  countrySeed,
  stateSeed,
  templateSeed,
];

export default seeds;

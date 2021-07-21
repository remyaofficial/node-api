export class SeedReference {
  model: string;
  where: any;

  constructor(ref) {
    this.model = ref.model;
    this.where = ref.where;
  }
}

export interface SeedRecord {
  [key: string]: null | boolean | number | string | Date | SeedReference;
}

export class Seed {
  model: string;
  action: 'never' | 'once' | 'always';
  data: SeedRecord[];
}

import { Seed } from '../core/modules/seeder/seeder.dto';

const seed: Seed = {
  model: 'Page',
  action: 'once',
  data: [
    {
      name: 'about_us',
      title: 'About Us',
      content: 'Sample about us',
      allow_html: false,
    },
    {
      name: 'privacy',
      title: 'Privacy Policy',
      content: 'Sample privacy policy',
      allow_html: true,
    },
    {
      name: 'terms',
      title: 'Terms and Conditions',
      content: 'Sample terms and conditions',
      allow_html: true,
    },
  ],
};

export default seed;

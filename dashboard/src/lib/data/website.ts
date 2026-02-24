import { ProgramInfo } from '../types/governance';

// Static program info from tahomabearsbaseball.com
// This avoids runtime scraping - data is refreshed manually when needed
export function getProgramInfo(): ProgramInfo {
  return {
    schoolName: 'Tahoma High School',
    mascot: 'Bears',
    address: '23499 SE Tahoma Way, Maple Valley, WA 98038',
    email: 'tahomabaseballbooster@gmail.com',
    website: 'https://www.tahomabearsbaseball.com',
    socialMedia: {
      facebook: 'https://www.facebook.com/profile.php?id=61573587485878',
      instagram: 'https://www.instagram.com/tahoma_baseball/',
      tiktok: 'https://www.tiktok.com/@tahoma_baseball',
      x: 'https://x.com/TahomaBaseball',
    },
    sponsors: [
      {
        name: 'Success Martial Arts',
        url: 'https://www.rentontaekwondo.com/',
        logo: 'https://images.squarespace-cdn.com/content/v1/672fdd06116b94632b74e10f/9bdf8f26-b16a-4138-8204-fc9b96327c1c/Success+Martial+Arts+Logo.png',
      },
      {
        name: 'Rock Creek Baseball',
        url: 'https://www.rockcreekselect.com/',
        logo: 'https://images.squarespace-cdn.com/content/v1/672fdd06116b94632b74e10f/2ff3ee35-1589-4c32-aa01-fd665287fa5b/rc_medium.png',
      },
      {
        name: 'Tim McEwen — Keller Williams',
        url: 'https://timmcewen.kw.com/',
        logo: 'https://images.squarespace-cdn.com/content/v1/672fdd06116b94632b74e10f/c6fc9b24-ca7b-4515-bf52-d2258aef1593/0.png',
      },
      {
        name: 'P&D Tree Service',
        url: 'https://www.panddtreeservice.com/',
        logo: 'https://images.squarespace-cdn.com/content/v1/672fdd06116b94632b74e10f/d33bac3c-5885-4564-a180-2f6d5fed2149/Pnd+Red+Logo.png',
      },
      {
        name: 'Grace Glove Company',
        url: 'https://www.graceglovecompany.com/',
        logo: 'https://images.squarespace-cdn.com/content/v1/672fdd06116b94632b74e10f/e8aac2da-af2e-4c4e-8552-e1d1d7fc277e/Grace+Glove+logo.png',
      },
      {
        name: 'Edgewood Sheds (Old Hickory)',
        url: 'https://edgewoodsheds.com/',
        logo: 'https://images.squarespace-cdn.com/content/v1/672fdd06116b94632b74e10f/1fb17808-d074-47cf-8a99-97e361c25fa3/OHS+Authorized+Dealer+Logo+-+Blue.png',
      },
      {
        name: 'Oakhearth Homes',
        url: 'https://www.oakhearthhomes.com/',
        logo: 'https://images.squarespace-cdn.com/content/v1/672fdd06116b94632b74e10f/bf1d766b-22a8-4d16-afaf-8cab9230eeb8/1744659630799-eee1843c-f209-4dab-83b0-b4c2cadf0cc7_1.jpg',
      },
      {
        name: 'Country Financial',
        url: 'https://agents.countryfinancial.com/usa/wa/puyallup/ehrin-stumpges',
        logo: 'https://images.squarespace-cdn.com/content/v1/672fdd06116b94632b74e10f/b55e2a49-7fe6-47dd-9ce1-1ef0c21b7a35/CountryFinancial.png',
      },
      {
        name: 'Emerald City Smoothie',
        url: 'https://www.emeraldcitysmoothie.com/locations/maple-valley',
        logo: 'https://images.squarespace-cdn.com/content/v1/672fdd06116b94632b74e10f/b910cfbb-a76d-42b1-9a8b-d0d925567f7b/ECS+logo+good.png',
      },
      {
        name: "Farrelli's Pizza",
        url: 'https://farrellispizza.com/',
        logo: 'https://images.squarespace-cdn.com/content/v1/672fdd06116b94632b74e10f/89511a24-6d6d-4c7f-acc5-fe3260f12d36/FP.png',
      },
    ],
  };
}

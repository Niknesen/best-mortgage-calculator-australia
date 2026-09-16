export interface Broker {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  website: string;
  address: string;
  suburb: string;
  city: string;
  state: string;
  postcode: string;
  rating: number;
  reviews: number;
  about: string;
  badge?: string;
}

export const FEATURED_BROKERS: Broker[] = [
  {
    id: 1,
    name: "Mortgage Broker Sydney",
    phone: "1300 983 670",
    email: "enquiries@mortgagebrokersydney.com.au",
    website: "https://mortgagebrokersydney.com.au",
    address: "Level 11/65 York St, Sydney NSW 2000",
    suburb: "Sydney",
    city: "Sydney",
    state: "NSW",
    postcode: "2000",
    rating: 5.0,
    reviews: 199,
    about: "A boutique Sydney brokerage trading since 2003, covering residential lending — first-home buyer, refinancing and investment loans — alongside commercial finance.",
    badge: "Top Rated Sydney"
  },
  {
    id: 60,
    name: "Mortgage Broker Melbourne",
    phone: "1800 111 626",
    email: "info@mortgagebrokermelbourne.net.au",
    website: "https://mortgagebrokermelbourne.net.au",
    address: "11/456 Lonsdale St, Melbourne VIC 3000",
    suburb: "Melbourne",
    city: "Melbourne",
    state: "VIC",
    postcode: "3000",
    rating: 5.0,
    reviews: 586,
    about: "A boutique Melbourne CBD brokerage trading since 1999 and accredited with MFAA. Offers first-home buyer, refinancing and investment lending at no direct cost.",
    badge: "Top Rated Melbourne"
  },
  {
    id: 118,
    name: "Hunter Galloway Mortgage Broker Brisbane",
    phone: "(07) 3554 1015",
    email: "hello@huntergalloway.com.au",
    website: "https://www.huntergalloway.com.au",
    address: "Level 10/95 N Quay, Brisbane City QLD 4000",
    suburb: "Brisbane City",
    city: "Brisbane",
    state: "QLD",
    postcode: "4000",
    rating: 5.0,
    reviews: 2497,
    about: "An independently owned Brisbane brokerage with 35+ years combined industry experience and direct access to 30+ Australian lenders.",
    badge: "2,400+ 5-Star Reviews"
  },
  {
    id: 172,
    name: "Orange Mortgage & Finance Brokers Perth",
    phone: "0425 212 636",
    email: "contact@orangefinance.net.au",
    website: "https://www.orangefinance.net.au",
    address: "Unit 10/46 Angove St, North Perth WA 6006",
    suburb: "North Perth",
    city: "Perth",
    state: "WA",
    postcode: "6006",
    rating: 5.0,
    reviews: 260,
    about: "An owner-led North Perth brokerage specialising in first-home buyer, construction, refinancing and investment lending. Australian Credit Licence #390618.",
    badge: "Top Rated Perth"
  },
  {
    id: 219,
    name: "Palm Tree Finance Adelaide",
    phone: "0430 583 666",
    email: "paul@palmtreefinance.com.au",
    website: "http://www.palmtreefinance.com.au",
    address: "Unit 2/241 Pirie St, Adelaide SA 5000",
    suburb: "Adelaide",
    city: "Adelaide",
    state: "SA",
    postcode: "5000",
    rating: 5.0,
    reviews: 142,
    about: "Specialises in first home buyer applications, family guarantee loans, refinancing and investment portfolios across South Australia.",
    badge: "Top Rated Adelaide"
  },
  {
    id: 250,
    name: "Derwent Finance Hobart",
    phone: "(03) 6144 9555",
    email: "info@derwentfinance.com.au",
    website: "https://derwentfinance.com.au",
    address: "Level 1/162 Macquarie St, Hobart TAS 7000",
    suburb: "Hobart",
    city: "Hobart",
    state: "TAS",
    postcode: "7000",
    rating: 4.9,
    reviews: 310,
    about: "Tasmania's premier mortgage brokerage helping locals navigate state concessions, first home schemes and competitive refinancing.",
    badge: "Top Rated Tasmania"
  },
  {
    id: 310,
    name: "Canberra Home Loans",
    phone: "(02) 6188 5600",
    email: "admin@canberrahl.com.au",
    website: "https://canberrahl.com.au",
    address: "Level 2/10 Moore St, Canberra ACT 2601",
    suburb: "Canberra",
    city: "Canberra",
    state: "ACT",
    postcode: "2601",
    rating: 5.0,
    reviews: 188,
    about: "Expert ACT brokers specialising in APS government employee home loans, stamp duty concession navigation and fast pre-approvals.",
    badge: "Top Rated ACT"
  }
];

export function findBrokers(queryState?: string, queryPostcode?: string): Broker[] {
  if (queryPostcode) {
    const matchedPostcode = FEATURED_BROKERS.filter(b => b.postcode === queryPostcode);
    if (matchedPostcode.length > 0) return matchedPostcode;
  }
  if (queryState) {
    const matched = FEATURED_BROKERS.filter(b => b.state.toUpperCase() === queryState.toUpperCase());
    if (matched.length > 0) return matched;
  }
  return FEATURED_BROKERS;
}

export interface BlogArticle {
  id: string;
  order?: number;
  title: string;
  author: string;
  date: string;
  image: string;
  subtitle?: string;
  description?: string;
  offers?: string[];
  highlights?: string[];
  whyInvest?: string[];
  contactPhone?: string;
  patnaOffice?: string;
  noidaOffice?: string;
}

export const DEFAULT_BLOGS: BlogArticle[] = [
  {
    id: "remarkable-success-bihar",
    order: 1,
    title: "After Our Remarkable Success In Bihar",
    author: "Patliputra",
    date: "07-August 2025",
    image:
      "https://mbfrobyozijbwglauqop.supabase.co/storage/v1/object/public/project%20images/Blogs/blog_bihar_success.png",
    subtitle: "Patliputra Signature Park – Now in Greater Noida!",
    description:
      "After our remarkable success in Bihar, we're expanding to Greater Noida with a landmark investment opportunity.",
    offers: [
      "12% Assured Return Till Possession",
      "Offer valid only till 30th June 2025",
      "RERA Approved Project (UPRERAPRJ422327/10/2024)",
      "Construction in Full Swing",
    ],
    highlights: [
      "Premium Studio Apartments, Office Spaces & Retail Shops",
      "Located in Sector Chi V, one of Greater Noida's most promising zones",
      "Backed by the trusted Patliputra Group",
    ],
    whyInvest: [
      "High returns with low entry point",
      "Fully secure, RERA-compliant project",
      "Ideal for working professionals, startups & smart investors",
      "Assured rental income before possession",
    ],
    contactPhone: "+91 9771417077",
    patnaOffice: "301, Maharaja Kameshwar Complex, Frazer Road, Patna",
    noidaOffice: "Plot No. INS - 02, Sector - Chi V, Greater Noida",
  },
  {
    id: "now-in-greater-noida",
    order: 2,
    title: "Now In Greater Noida",
    author: "Patliputra",
    date: "07-August 2025",
    image:
      "https://mbfrobyozijbwglauqop.supabase.co/storage/v1/object/public/project%20images/Blogs/blog_greater_noida.png",
    subtitle: "Signature Landmark on the Yamuna Expressway Corridor",
    description:
      "Experience unmatched commercial & luxury studio living in Greater Noida Chi V with guaranteed returns and flexible payment schemes.",
    offers: [
      "12% Assured Return till Possession",
      "Right Time, Right Investment",
      "Special 50:25:25 Flexible Payment Plan",
      "Construction in Full Swing",
    ],
    highlights: [
      "Situated at Entrance of Greater Noida before Pari Chowk",
      "High-visibility retail frontage with premium office spaces",
      "Next to major business enclaves and universities",
    ],
    whyInvest: [
      "Exponential capital appreciation in Yamuna Expressway corridor",
      "Direct metro & expressway connectivity to Jewar Airport",
      "Guaranteed corporate lease assistance post possession",
    ],
    contactPhone: "+91 9771417077",
    patnaOffice: "301, Maharaja Kameshwar Complex, Frazer Road, Patna",
    noidaOffice: "Plot No. INS - 02, Sector - Chi V, Greater Noida",
  },
  {
    id: "offer-patliputra-signature-park",
    order: 3,
    title: "Offer Patliputra Signature Park",
    author: "Patliputra",
    date: "07-August 2025",
    image:
      "https://mbfrobyozijbwglauqop.supabase.co/storage/v1/object/public/project%20images/Blogs/blog_signature_park_offer.png",
    subtitle: "Invest Smart, Earn Early: Fully Furnished Studio Apartments",
    description:
      "Invest in luxury studio apartments starting at ₹27 Lakh with assured monthly rentals of ₹27,000/- right from day one.",
    offers: [
      "Just Pay ₹ 27,00,000*",
      "Assured Returns ₹ 27,000/- Per Month",
      "Fully Furnished Studio Apartment with Turnkey Handover",
      "Payment Plan: 50:25:25",
    ],
    highlights: [
      "Designer turnkey interiors with international grade fittings",
      "Exclusive club membership and concierge services",
      "High rental demand from corporate hubs & IT corridors",
    ],
    whyInvest: [
      "Immediate monthly cash flow before possession",
      "Hassle-free fully managed rental asset",
      "Trusted 35+ years legacy of Patliputra Group",
    ],
    contactPhone: "+91 9771417077",
    patnaOffice: "301, Maharaja Kameshwar Complex, Frazer Road, Patna",
    noidaOffice: "Plot No. INS - 02, Sector - Chi V, Greater Noida",
  },
];

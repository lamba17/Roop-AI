export interface MakeupArtist {
  name: string;
  studio: string;
  rating: number;
  specialty: string;
  priceRange: string;
  googleMapsLink: string;
}

export const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  Dehradun:  { lat: 30.3165, lng: 78.0322 },
  Delhi:     { lat: 28.6139, lng: 77.2090 },
  Mumbai:    { lat: 19.0760, lng: 72.8777 },
  Bangalore: { lat: 12.9716, lng: 77.5946 },
  Chennai:   { lat: 13.0827, lng: 80.2707 },
  Hyderabad: { lat: 17.3850, lng: 78.4867 },
  Pune:      { lat: 18.5204, lng: 73.8567 },
};

export const MAKEUP_ARTISTS: Record<string, MakeupArtist[]> = {
  Dehradun: [
    {
      name: 'Antheia Enhance',
      studio: 'MJ Tower, Rajpur Road, Dehradun',
      rating: 4.8,
      specialty: 'Bridal & Party Makeup',
      priceRange: '₹2,000 – ₹8,000',
      googleMapsLink: 'https://www.google.com/maps/search/Antheia+Enhance+Rajpur+Road+Dehradun',
    },
    {
      name: 'Makeovers by Sugandha',
      studio: 'Dehrakhas, Dehradun',
      rating: 4.7,
      specialty: 'Bridal Makeup & Hair Styling',
      priceRange: '₹1,500 – ₹6,000',
      googleMapsLink: 'https://www.google.com/maps/search/Makeovers+by+Sugandha+Dehradun',
    },
    {
      name: 'G5 Makeup Studio & Academy',
      studio: 'Race Course Road, Dehradun',
      rating: 4.6,
      specialty: 'HD & Airbrush Makeup',
      priceRange: '₹1,500 – ₹5,000',
      googleMapsLink: 'https://www.google.com/maps/search/G5+Makeup+Studio+Academy+Dehradun',
    },
  ],
  Delhi: [
    {
      name: 'Attraction Beauty Studio',
      studio: 'Rohini Sector 17, New Delhi',
      rating: 4.5,
      specialty: 'Bridal & Party Makeup',
      priceRange: '₹2,000 – ₹8,000',
      googleMapsLink: 'https://www.google.com/maps/search/Attraction+Beauty+Studio+Rohini+Sector+17+Delhi',
    },
    {
      name: 'House of Beauty by Sahil Malhotra',
      studio: 'Rajouri Garden, New Delhi',
      rating: 4.9,
      specialty: 'Bridal & HD Airbrush Makeup',
      priceRange: '₹5,000 – ₹25,000',
      googleMapsLink: 'https://www.google.com/maps/search/House+of+Beauty+Sahil+Malhotra+Rajouri+Garden+Delhi',
    },
    {
      name: 'Isheeta Gupta Makeup Studio',
      studio: 'Central Delhi, NCR',
      rating: 4.8,
      specialty: 'Bridal & Airbrush Makeup',
      priceRange: '₹4,000 – ₹15,000',
      googleMapsLink: 'https://www.google.com/maps/search/Isheeta+Gupta+Makeup+Studio+Delhi',
    },
  ],
  Mumbai: [
    {
      name: 'Faritas Academy and Salon',
      studio: 'Laxmi Industrial Estate, Andheri West, Mumbai',
      rating: 4.8,
      specialty: 'Bridal Studio & Makeup Academy',
      priceRange: '₹4,000 – ₹18,000',
      googleMapsLink: 'https://www.google.com/maps/search/Faritas+Academy+Salon+Andheri+West+Mumbai',
    },
    {
      name: 'Beautyart Bridal Studio',
      studio: 'Ghatkopar East, Mumbai',
      rating: 4.7,
      specialty: 'Bridal Makeup',
      priceRange: '₹3,500 – ₹12,000',
      googleMapsLink: 'https://www.google.com/maps/search/Beautyart+Bridal+Studio+Ghatkopar+Mumbai',
    },
    {
      name: 'ReemaZ Makeover',
      studio: 'Mumbai',
      rating: 4.8,
      specialty: 'Bridal & Party Makeup',
      priceRange: '₹5,000 – ₹20,000',
      googleMapsLink: 'https://www.google.com/maps/search/ReemaZ+Makeover+Mumbai',
    },
  ],
  Bangalore: [
    {
      name: 'MJ Gorgeous Makeup Studio',
      studio: 'Arekere, Bengaluru',
      rating: 4.9,
      specialty: 'Bridal & South Indian Makeup',
      priceRange: '₹3,000 – ₹12,000',
      googleMapsLink: 'https://www.google.com/maps/search/MJ+Gorgeous+Makeup+Studio+Arekere+Bangalore',
    },
    {
      name: 'Zorains Studio & Academy',
      studio: 'Amar Jyothi Layout, Bengaluru',
      rating: 4.8,
      specialty: 'Bridal, Hair & Nails',
      priceRange: '₹4,000 – ₹15,000',
      googleMapsLink: 'https://www.google.com/maps/search/Zorains+Studio+Academy+Bangalore',
    },
    {
      name: 'Kulsum Parvez',
      studio: 'Langford Road, Bengaluru',
      rating: 4.9,
      specialty: 'Celebrity Bridal Makeup',
      priceRange: '₹6,000 – ₹20,000',
      googleMapsLink: 'https://www.google.com/maps/search/Kulsum+Parvez+Makeup+Artist+Bangalore',
    },
  ],
  Chennai: [
    {
      name: 'Noor Bridal Studio',
      studio: 'Arumbakkam, Chennai',
      rating: 4.9,
      specialty: 'Bridal & Cine Makeup',
      priceRange: '₹3,000 – ₹15,000',
      googleMapsLink: 'https://www.google.com/maps/search/Noor+Bridal+Studio+Arumbakkam+Chennai',
    },
    {
      name: 'SAY Bridal Studio',
      studio: 'Kolathur, Chennai',
      rating: 4.7,
      specialty: 'Bridal & Engagement Makeup',
      priceRange: '₹2,000 – ₹10,000',
      googleMapsLink: 'https://www.google.com/maps/search/SAY+Bridal+Studio+Kolathur+Chennai',
    },
  ],
  Hyderabad: [
    {
      name: 'SminkUp Bridal Makeup Studio',
      studio: 'Jubilee Hills, Hyderabad',
      rating: 4.8,
      specialty: 'Bridal Makeup',
      priceRange: '₹4,000 – ₹18,000',
      googleMapsLink: 'https://www.google.com/maps/search/SminkUp+Bridal+Makeup+Studio+Jubilee+Hills+Hyderabad',
    },
    {
      name: 'Tamanna Rooz Makeup Studio',
      studio: 'Banjara Hills, Hyderabad',
      rating: 4.9,
      specialty: 'Bridal & Fashion Makeup',
      priceRange: '₹5,000 – ₹20,000',
      googleMapsLink: 'https://www.google.com/maps/search/Tamanna+Rooz+Makeup+Studio+Banjara+Hills+Hyderabad',
    },
    {
      name: 'iGrace Beauty',
      studio: 'Jubilee Hills, Hyderabad',
      rating: 4.7,
      specialty: 'Bridal, Film & Fashion Makeup',
      priceRange: '₹3,500 – ₹14,000',
      googleMapsLink: 'https://www.google.com/maps/search/iGrace+Beauty+Jubilee+Hills+Hyderabad',
    },
  ],
  Pune: [
    {
      name: 'Pallavi Raut Makeover',
      studio: 'Katraj, Pune',
      rating: 5.0,
      specialty: 'Bridal Makeup',
      priceRange: '₹3,000 – ₹12,000',
      googleMapsLink: 'https://www.google.com/maps/search/Pallavi+Raut+Makeover+Pune',
    },
    {
      name: 'Anuja Khele Beauty',
      studio: 'Bavdhan, Pune',
      rating: 4.8,
      specialty: 'Bridal Makeup & Hair',
      priceRange: '₹2,500 – ₹10,000',
      googleMapsLink: 'https://www.google.com/maps/search/Anuja+Khele+Beauty+Stylishious+Salon+Pune',
    },
    {
      name: 'Pallavi Patil Makeup Artist',
      studio: 'Pune University Area, Pune',
      rating: 4.7,
      specialty: 'Bridal & Wedding Makeup',
      priceRange: '₹2,000 – ₹8,000',
      googleMapsLink: 'https://www.google.com/maps/search/Pallavi+Patil+Makeup+Artist+Pune',
    },
  ],
};

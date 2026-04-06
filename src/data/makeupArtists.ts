export interface MakeupArtist {
  name: string;
  studio: string;
  rating: number;
  specialty: string;
  priceRange: string;
  instagramHandle?: string;
  googleMapsLink?: string;
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
    { name: 'Priya Makeovers', studio: 'Rajpur Road, Dehradun', rating: 4.8, specialty: 'Bridal & Party Makeup', priceRange: '₹2,000 – ₹8,000' },
    { name: 'Glam Studio by Neha', studio: 'Paltan Bazaar, Dehradun', rating: 4.6, specialty: 'Editorial & HD Makeup', priceRange: '₹1,500 – ₹6,000' },
  ],
  Delhi: [
    { name: 'Ambika Pillai Studio', studio: 'Defence Colony, New Delhi', rating: 4.9, specialty: 'Celebrity & Bridal', priceRange: '₹5,000 – ₹25,000' },
    { name: 'Mickey Contractor MUA', studio: 'Hauz Khas, New Delhi', rating: 4.9, specialty: 'Film & Fashion Makeup', priceRange: '₹8,000 – ₹30,000' },
    { name: 'Juice Salon', studio: 'Khan Market, New Delhi', rating: 4.7, specialty: 'Everyday & Party Glam', priceRange: '₹2,000 – ₹10,000' },
  ],
  Mumbai: [
    { name: 'Elton J. Fernandez', studio: 'Bandra West, Mumbai', rating: 4.9, specialty: 'Bollywood & Bridal', priceRange: '₹10,000 – ₹40,000' },
    { name: 'Shradha Beauty Studio', studio: 'Juhu, Mumbai', rating: 4.8, specialty: 'HD & Airbrush Makeup', priceRange: '₹4,000 – ₹15,000' },
    { name: 'Bianca Louzado MUA', studio: 'Andheri West, Mumbai', rating: 4.7, specialty: 'Editorial & Glam', priceRange: '₹3,500 – ₹12,000' },
  ],
  Bangalore: [
    { name: 'Namrata Soni Studio', studio: 'Indiranagar, Bangalore', rating: 4.9, specialty: 'Celebrity & Bridal', priceRange: '₹6,000 – ₹20,000' },
    { name: 'Glam Art by Divya', studio: 'Koramangala, Bangalore', rating: 4.7, specialty: 'Party & Everyday Makeup', priceRange: '₹2,500 – ₹8,000' },
  ],
  Chennai: [
    { name: 'Meera Makeup Studio', studio: 'Anna Nagar, Chennai', rating: 4.8, specialty: 'Bridal & South Indian Looks', priceRange: '₹3,000 – ₹12,000' },
    { name: 'Lakshmi Beauty Lounge', studio: 'T. Nagar, Chennai', rating: 4.6, specialty: 'HD & Airbrush Makeup', priceRange: '₹2,000 – ₹9,000' },
  ],
  Hyderabad: [
    { name: 'Roshni Makeup Academy', studio: 'Banjara Hills, Hyderabad', rating: 4.9, specialty: 'Bridal & Film Makeup', priceRange: '₹4,000 – ₹18,000' },
    { name: 'Studio Glam Hyderabad', studio: 'Jubilee Hills, Hyderabad', rating: 4.7, specialty: 'Party & Editorial', priceRange: '₹2,500 – ₹10,000' },
  ],
  Pune: [
    { name: 'Pooja Gaikwad MUA', studio: 'Koregaon Park, Pune', rating: 4.8, specialty: 'Bridal & Destination Makeup', priceRange: '₹3,000 – ₹14,000' },
    { name: 'Glam Aura Studio', studio: 'Viman Nagar, Pune', rating: 4.6, specialty: 'HD & Airbrush Makeup', priceRange: '₹2,000 – ₹8,000' },
  ],
};

export interface Dermatologist {
  name: string;
  clinic: string;
  rating: number;
  specialty: string;
  phone?: string;
  googleMapsLink?: string;
}

export const DERMATOLOGISTS: Record<string, Dermatologist[]> = {
  Dehradun: [
    { name: 'Dr. Anita Rawat', clinic: 'Dehradun Skin Centre, Rajpur Road', rating: 4.7, specialty: 'General Dermatology' },
    { name: 'Dr. Sumit Joshi', clinic: 'Alpine Skin Clinic, Paltan Bazaar', rating: 4.6, specialty: 'Hair & Skin' },
  ],
  Delhi: [
    { name: 'Dr. Pooja Sharma', clinic: 'Skin Solutions, Connaught Place', rating: 4.9, specialty: 'Acne & Pigmentation' },
    { name: 'Dr. Arjun Mehta', clinic: 'DermaCare Clinic, South Ex', rating: 4.8, specialty: 'Hair & Scalp' },
  ],
  Mumbai: [
    { name: 'Dr. Neha Kale', clinic: 'GlowSkin, Bandra', rating: 4.9, specialty: 'Cosmetic Dermatology' },
    { name: 'Dr. Rahul Desai', clinic: 'SkinFirst, Juhu', rating: 4.7, specialty: 'Laser & Pigmentation' },
  ],
  Bangalore: [
    { name: 'Dr. Priya Iyer', clinic: 'DermaCure, Indiranagar', rating: 4.8, specialty: 'Acne & Rosacea' },
    { name: 'Dr. Kiran Rao', clinic: 'ClearSkin Clinic, Koramangala', rating: 4.9, specialty: 'Anti-Aging' },
  ],
  Chennai: [
    { name: 'Dr. Lakshmi Venkat', clinic: 'Radiance Clinic, Anna Nagar', rating: 4.8, specialty: 'Hyperpigmentation' },
  ],
  Hyderabad: [
    { name: 'Dr. Srinivas Reddy', clinic: 'SkinCure, Banjara Hills', rating: 4.9, specialty: 'Medical Dermatology' },
  ],
  Pune: [
    { name: 'Dr. Sneha Kulkarni', clinic: 'DermaPlus, Koregaon Park', rating: 4.7, specialty: 'Cosmetic & Medical' },
  ],
};

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
    { name: 'Dr. Anita Rawat', clinic: 'Dehradun Skin Centre, Rajpur Road', rating: 4.7, specialty: 'General Dermatology', googleMapsLink: 'https://maps.google.com/?q=dermatologist+Rajpur+Road+Dehradun' },
    { name: 'Dr. Sumit Joshi', clinic: 'Alpine Skin Clinic, Paltan Bazaar', rating: 4.6, specialty: 'Hair & Skin', googleMapsLink: 'https://maps.google.com/?q=skin+clinic+Paltan+Bazaar+Dehradun' },
  ],
  Delhi: [
    { name: 'Dr. Pooja Sharma', clinic: 'Skin Solutions, Connaught Place', rating: 4.9, specialty: 'Acne & Pigmentation', googleMapsLink: 'https://maps.google.com/?q=dermatologist+Connaught+Place+Delhi' },
    { name: 'Dr. Arjun Mehta', clinic: 'DermaCare Clinic, South Ex', rating: 4.8, specialty: 'Hair & Scalp', googleMapsLink: 'https://maps.google.com/?q=dermatologist+South+Extension+Delhi' },
  ],
  Mumbai: [
    { name: 'Dr. Neha Kale', clinic: 'GlowSkin, Bandra', rating: 4.9, specialty: 'Cosmetic Dermatology', googleMapsLink: 'https://maps.google.com/?q=dermatologist+Bandra+Mumbai' },
    { name: 'Dr. Rahul Desai', clinic: 'SkinFirst, Juhu', rating: 4.7, specialty: 'Laser & Pigmentation', googleMapsLink: 'https://maps.google.com/?q=dermatologist+Juhu+Mumbai' },
  ],
  Bangalore: [
    { name: 'Dr. Priya Iyer', clinic: 'DermaCure, Indiranagar', rating: 4.8, specialty: 'Acne & Rosacea', googleMapsLink: 'https://maps.google.com/?q=dermatologist+Indiranagar+Bangalore' },
    { name: 'Dr. Kiran Rao', clinic: 'ClearSkin Clinic, Koramangala', rating: 4.9, specialty: 'Anti-Aging', googleMapsLink: 'https://maps.google.com/?q=dermatologist+Koramangala+Bangalore' },
  ],
  Chennai: [
    { name: 'Dr. Lakshmi Venkat', clinic: 'Radiance Clinic, Anna Nagar', rating: 4.8, specialty: 'Hyperpigmentation', googleMapsLink: 'https://maps.google.com/?q=dermatologist+Anna+Nagar+Chennai' },
  ],
  Hyderabad: [
    { name: 'Dr. Srinivas Reddy', clinic: 'SkinCure, Banjara Hills', rating: 4.9, specialty: 'Medical Dermatology', googleMapsLink: 'https://maps.google.com/?q=dermatologist+Banjara+Hills+Hyderabad' },
  ],
  Pune: [
    { name: 'Dr. Sneha Kulkarni', clinic: 'DermaPlus, Koregaon Park', rating: 4.7, specialty: 'Cosmetic & Medical', googleMapsLink: 'https://maps.google.com/?q=dermatologist+Koregaon+Park+Pune' },
  ],
};

export interface Dermatologist {
  name: string;
  clinic: string;
  rating: number;
  specialty: string;
  phone?: string;
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

export const DERMATOLOGISTS: Record<string, Dermatologist[]> = {
  Dehradun: [
    { name: 'Dr. Varun Sarin', clinic: "Dr. Sarin's Cosmoderma Skin, Hair & Laser Centre", rating: 4.8, specialty: 'Cosmetic Dermatology', googleMapsLink: "https://maps.google.com/?q=Dr+Sarin+Cosmoderma+Skin+Hair+Laser+Centre+Dehradun" },
    { name: 'Dr. Archana Gulati', clinic: 'Perfect Look Skin and Diagnostic Center, Dehradun', rating: 4.7, specialty: 'Acne & Anti-Aging', googleMapsLink: 'https://maps.google.com/?q=Perfect+Look+Skin+Diagnostic+Center+Dehradun' },
    { name: 'Dr. Deepti Dhingra', clinic: 'Skin Station, Dehradun', rating: 4.8, specialty: 'Trichology & Laser', googleMapsLink: 'https://maps.google.com/?q=Skin+Station+Dehradun' },
  ],
  Delhi: [
    { name: 'Dr. Geetika Srivastava', clinic: 'Influennz Skin Clinic, South Delhi', rating: 4.9, specialty: 'Aesthetic Dermatology', googleMapsLink: 'https://maps.google.com/?q=Influennz+Skin+Clinic+South+Delhi' },
    { name: 'Dr. Anil Ganjoo', clinic: "Dr. Ganjoo's Skin Clinic, Delhi", rating: 4.9, specialty: 'Dermatosurgery', googleMapsLink: "https://maps.google.com/?q=Dr+Ganjoo+Skin+Clinic+Delhi" },
    { name: 'Dr. Lipy Gupta', clinic: 'Skin & Hair Clinic, Delhi', rating: 4.8, specialty: 'Acne & Pigmentation', googleMapsLink: 'https://maps.google.com/?q=Dr+Lipy+Gupta+Dermatologist+Delhi' },
  ],
  Mumbai: [
    { name: 'Dr. Shrilata Trasi', clinic: 'Dr. Trasi\'s Clinic, Mumbai', rating: 4.9, specialty: 'Cosmetic Dermatology', googleMapsLink: "https://maps.google.com/?q=Dr+Shrilata+Trasi+Clinic+Mumbai" },
    { name: 'Dr. Monica Bambroo', clinic: 'Dermato-Surgery & Skin Clinic, Mumbai', rating: 4.8, specialty: 'Dermato-Surgery', googleMapsLink: 'https://maps.google.com/?q=Dr+Monica+Bambroo+Dermatologist+Mumbai' },
  ],
  Bangalore: [
    { name: 'Dr. Rasya Dixit', clinic: 'Dr. Dixit\'s Cosmetic Dermatology Clinic, Indiranagar', rating: 4.9, specialty: 'Cosmetic Dermatology', googleMapsLink: "https://maps.google.com/?q=Dr+Dixit+Cosmetic+Dermatology+Clinic+Indiranagar+Bangalore" },
    { name: 'Dr. Nischal K', clinic: 'Oliva Skin & Hair Clinic, Koramangala', rating: 4.8, specialty: 'Hair & Scalp', googleMapsLink: 'https://maps.google.com/?q=Oliva+Skin+Hair+Clinic+Koramangala+Bangalore' },
  ],
  Chennai: [
    { name: 'Dr. Vatsan V', clinic: 'WEA Clinic, Velachery', rating: 4.9, specialty: 'Dermato-Surgery & Laser', googleMapsLink: 'https://maps.google.com/?q=WEA+Clinic+Velachery+Chennai' },
    { name: 'Dr. Janani A. Palanivel', clinic: 'DC Clinic, Velachery', rating: 4.8, specialty: 'Acne & Pigmentation', googleMapsLink: 'https://maps.google.com/?q=DC+Clinic+Velachery+Chennai' },
  ],
  Hyderabad: [
    { name: 'Oliva Skin & Hair Clinic', clinic: 'Oliva Clinics, Banjara Hills', rating: 4.9, specialty: 'Medical Dermatology', googleMapsLink: 'https://maps.google.com/?q=Oliva+Skin+Hair+Clinic+Banjara+Hills+Hyderabad' },
    { name: 'Oliva Skin & Hair Clinic', clinic: 'Oliva Clinics, Jubilee Hills', rating: 4.8, specialty: 'Laser & Anti-Aging', googleMapsLink: 'https://maps.google.com/?q=Oliva+Skin+Hair+Clinic+Jubilee+Hills+Hyderabad' },
  ],
  Pune: [
    { name: 'Dr. Anil Patki', clinic: 'Skin & Surgery International, Pune', rating: 4.9, specialty: 'General Dermatology', googleMapsLink: 'https://maps.google.com/?q=Skin+Surgery+International+Pune' },
    { name: 'Dr. Sunil Tolat', clinic: 'Tolat Skin Clinic, Pune', rating: 4.8, specialty: 'Cosmetic & Medical', googleMapsLink: 'https://maps.google.com/?q=Dr+Sunil+Tolat+Skin+Clinic+Pune' },
  ],
};

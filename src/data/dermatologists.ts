export interface Dermatologist {
  name: string;
  clinic: string;
  rating: number;
  specialty: string;
  phone?: string;
  googleMapsLink?: string;
  justDialLink?: string;
  instagramHandle?: string;
  priceRange?: string;
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
    {
      name: 'Dr. Varun Sarin',
      clinic: "Dr. Sarin's Cosmoderma Skin, Hair & Laser Centre",
      rating: 4.8,
      specialty: 'Cosmetic Dermatology',
      googleMapsLink: 'https://maps.google.com/?q=Dr+Sarin+Cosmoderma+Skin+Hair+Laser+Centre+Dehradun',
      justDialLink: 'https://www.justdial.com/Dehradun/Dr-Sarin-Cosmoderma-Skin-Hair-Laser-Centre/nct-10923456',
      instagramHandle: 'drsarincosmoderma',
      priceRange: '₹500 – ₹1,500',
    },
    {
      name: 'Dr. Archana Gulati',
      clinic: 'Perfect Look Skin and Diagnostic Center, Dehradun',
      rating: 4.7,
      specialty: 'Acne & Anti-Aging',
      googleMapsLink: 'https://maps.google.com/?q=Perfect+Look+Skin+Diagnostic+Center+Dehradun',
      justDialLink: 'https://www.justdial.com/Dehradun/Perfect-Look-Skin-Diagnostic-Center/nct-10987654',
      priceRange: '₹400 – ₹1,200',
    },
    {
      name: 'Dr. Deepti Dhingra',
      clinic: 'Skin Station, Dehradun',
      rating: 4.8,
      specialty: 'Trichology & Laser',
      googleMapsLink: 'https://maps.google.com/?q=Skin+Station+Dehradun',
      instagramHandle: 'skinstation_dehradun',
      priceRange: '₹600 – ₹1,800',
    },
  ],
  Delhi: [
    {
      name: 'Dr. Geetika Srivastava',
      clinic: 'Influennz Skin Clinic, South Delhi',
      rating: 4.9,
      specialty: 'Aesthetic Dermatology',
      googleMapsLink: 'https://maps.google.com/?q=Influennz+Skin+Clinic+South+Delhi',
      justDialLink: 'https://www.justdial.com/Delhi/Influennz-Skin-Clinic-South-Delhi/011PXX11-XX11-180312153042-B2C4_BZDET',
      instagramHandle: 'drgeeetika',
      priceRange: '₹1,500 – ₹3,000',
    },
    {
      name: 'Dr. Anil Ganjoo',
      clinic: "Dr. Ganjoo's Skin Clinic, Delhi",
      rating: 4.9,
      specialty: 'Dermatosurgery',
      googleMapsLink: 'https://maps.google.com/?q=Dr+Ganjoo+Skin+Clinic+Delhi',
      justDialLink: 'https://www.justdial.com/Delhi/Dr-Ganjoos-Skin-Clinic/011PXX11-XX11-150601122230-K9P7_BZDET',
      priceRange: '₹1,000 – ₹2,500',
    },
    {
      name: 'Dr. Lipy Gupta',
      clinic: 'Skin & Hair Clinic, Delhi',
      rating: 4.8,
      specialty: 'Acne & Pigmentation',
      googleMapsLink: 'https://maps.google.com/?q=Dr+Lipy+Gupta+Dermatologist+Delhi',
      instagramHandle: 'drlipygupta',
      priceRange: '₹800 – ₹2,000',
    },
  ],
  Mumbai: [
    {
      name: 'Dr. Shrilata Trasi',
      clinic: "Dr. Trasi's Clinic, Mumbai",
      rating: 4.9,
      specialty: 'Cosmetic Dermatology',
      googleMapsLink: 'https://maps.google.com/?q=Dr+Shrilata+Trasi+Clinic+Mumbai',
      justDialLink: 'https://www.justdial.com/Mumbai/Dr-Shrilata-Trasi-Clinic/022PXX22-XX22-140823094512-T6R1_BZDET',
      instagramHandle: 'drshrilatatrasi',
      priceRange: '₹1,200 – ₹3,000',
    },
    {
      name: 'Dr. Monica Bambroo',
      clinic: 'Dermato-Surgery & Skin Clinic, Mumbai',
      rating: 4.8,
      specialty: 'Dermato-Surgery',
      googleMapsLink: 'https://maps.google.com/?q=Dr+Monica+Bambroo+Dermatologist+Mumbai',
      instagramHandle: 'drmonicabambroo',
      priceRange: '₹1,000 – ₹2,500',
    },
  ],
  Bangalore: [
    {
      name: 'Dr. Rasya Dixit',
      clinic: "Dr. Dixit's Cosmetic Dermatology Clinic, Indiranagar",
      rating: 4.9,
      specialty: 'Cosmetic Dermatology',
      googleMapsLink: 'https://maps.google.com/?q=Dr+Dixit+Cosmetic+Dermatology+Clinic+Indiranagar+Bangalore',
      justDialLink: 'https://www.justdial.com/Bangalore/Dr-Dixit-Cosmetic-Dermatology-Clinic-Indiranagar/080PXX80-XX80-190501112233-R5D9_BZDET',
      instagramHandle: 'drrasyadixit',
      priceRange: '₹1,500 – ₹3,500',
    },
    {
      name: 'Dr. Nischal K',
      clinic: 'Oliva Skin & Hair Clinic, Koramangala',
      rating: 4.8,
      specialty: 'Hair & Scalp',
      googleMapsLink: 'https://maps.google.com/?q=Oliva+Skin+Hair+Clinic+Koramangala+Bangalore',
      instagramHandle: 'olivaclinic',
      priceRange: '₹1,000 – ₹2,500',
    },
  ],
  Chennai: [
    {
      name: 'Dr. Vatsan V',
      clinic: 'WEA Clinic, Velachery',
      rating: 4.9,
      specialty: 'Dermato-Surgery & Laser',
      googleMapsLink: 'https://maps.google.com/?q=WEA+Clinic+Velachery+Chennai',
      justDialLink: 'https://www.justdial.com/Chennai/WEA-Clinic-Velachery/044PXX44-XX44-200312093011-W2A4_BZDET',
      priceRange: '₹700 – ₹1,800',
    },
    {
      name: 'Dr. Janani A. Palanivel',
      clinic: 'DC Clinic, Velachery',
      rating: 4.8,
      specialty: 'Acne & Pigmentation',
      googleMapsLink: 'https://maps.google.com/?q=DC+Clinic+Velachery+Chennai',
      instagramHandle: 'drjananipalanivel',
      priceRange: '₹600 – ₹1,500',
    },
  ],
  Hyderabad: [
    {
      name: 'Oliva Skin & Hair Clinic',
      clinic: 'Oliva Clinics, Banjara Hills',
      rating: 4.9,
      specialty: 'Medical Dermatology',
      googleMapsLink: 'https://maps.google.com/?q=Oliva+Skin+Hair+Clinic+Banjara+Hills+Hyderabad',
      justDialLink: 'https://www.justdial.com/Hyderabad/Oliva-Clinic-Banjara-Hills/040PXX40-XX40-170823141512-O3L6_BZDET',
      instagramHandle: 'olivaclinic',
      priceRange: '₹900 – ₹2,200',
    },
    {
      name: 'Oliva Skin & Hair Clinic',
      clinic: 'Oliva Clinics, Jubilee Hills',
      rating: 4.8,
      specialty: 'Laser & Anti-Aging',
      googleMapsLink: 'https://maps.google.com/?q=Oliva+Skin+Hair+Clinic+Jubilee+Hills+Hyderabad',
      instagramHandle: 'olivaclinic',
      priceRange: '₹900 – ₹2,200',
    },
  ],
  Pune: [
    {
      name: 'Dr. Anil Patki',
      clinic: 'Skin & Surgery International, Pune',
      rating: 4.9,
      specialty: 'General Dermatology',
      googleMapsLink: 'https://maps.google.com/?q=Skin+Surgery+International+Pune',
      justDialLink: 'https://www.justdial.com/Pune/Skin-Surgery-International-Pune/020PXX20-XX20-150601100200-S9K3_BZDET',
      instagramHandle: 'skinandsurgery_pune',
      priceRange: '₹700 – ₹1,800',
    },
    {
      name: 'Dr. Sunil Tolat',
      clinic: 'Tolat Skin Clinic, Pune',
      rating: 4.8,
      specialty: 'Cosmetic & Medical',
      googleMapsLink: 'https://maps.google.com/?q=Dr+Sunil+Tolat+Skin+Clinic+Pune',
      instagramHandle: 'tolatskinclinic',
      priceRange: '₹600 – ₹1,500',
    },
  ],
};

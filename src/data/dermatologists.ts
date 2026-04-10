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
    { name: 'Dr. Varun Sarin', clinic: "Dr. Sarin's Cosmoderma Skin, Hair & Laser Centre", rating: 4.8, specialty: 'Cosmetic Dermatology', googleMapsLink: 'https://maps.google.com/?q=Dr+Sarin+Cosmoderma+Skin+Hair+Laser+Centre+Dehradun', justDialLink: 'https://www.justdial.com/Dehradun/Dr-Sarin-Cosmoderma-Skin-Hair-Laser-Centre/nct-10923456', instagramHandle: 'drsarincosmoderma', priceRange: '₹500 – ₹1,500' },
    { name: 'Dr. Archana Gulati', clinic: 'Perfect Look Skin and Diagnostic Center, Dehradun', rating: 4.7, specialty: 'Acne & Anti-Aging', googleMapsLink: 'https://maps.google.com/?q=Perfect+Look+Skin+Diagnostic+Center+Dehradun', justDialLink: 'https://www.justdial.com/Dehradun/Perfect-Look-Skin-Diagnostic-Center/nct-10987654', priceRange: '₹400 – ₹1,200' },
    { name: 'Dr. Deepti Dhingra', clinic: 'Skin Station, Dehradun', rating: 4.8, specialty: 'Trichology & Laser', googleMapsLink: 'https://maps.google.com/?q=Skin+Station+Dehradun', priceRange: '₹600 – ₹1,800' },
    { name: 'Dr. Shweta Upadhyay', clinic: 'Skin & Smile Clinic, Rajpur Road, Dehradun', rating: 4.6, specialty: 'General Dermatology', googleMapsLink: 'https://maps.google.com/?q=Skin+Smile+Clinic+Rajpur+Road+Dehradun', justDialLink: 'https://www.justdial.com/Dehradun/Skin-Smile-Clinic-Rajpur-Road/nct-11023401', priceRange: '₹300 – ₹900' },
    { name: 'Dr. Ankit Tandon', clinic: 'DermaCare Clinic, Ballupur, Dehradun', rating: 4.5, specialty: 'Acne & Pigmentation', googleMapsLink: 'https://maps.google.com/?q=DermaCare+Clinic+Ballupur+Dehradun', priceRange: '₹400 – ₹1,000' },
    { name: 'Dr. Priya Negi', clinic: 'Glow Skin Clinic, Dalanwala, Dehradun', rating: 4.6, specialty: 'Laser & Skin Rejuvenation', googleMapsLink: 'https://maps.google.com/?q=Glow+Skin+Clinic+Dalanwala+Dehradun', instagramHandle: 'glowskindehradun', priceRange: '₹500 – ₹1,500' },
    { name: 'Dr. Ritu Singhal', clinic: 'Advanced Skin Care Centre, GMS Road, Dehradun', rating: 4.7, specialty: 'Hair Loss & Scalp', googleMapsLink: 'https://maps.google.com/?q=Advanced+Skin+Care+Centre+GMS+Road+Dehradun', justDialLink: 'https://www.justdial.com/Dehradun/Advanced-Skin-Care-Centre-GMS-Road/nct-11145600', priceRange: '₹500 – ₹1,400' },
    { name: 'Dr. Sumit Rawat', clinic: 'ClearSkin Clinic, Patel Nagar, Dehradun', rating: 4.5, specialty: 'Psoriasis & Eczema', googleMapsLink: 'https://maps.google.com/?q=ClearSkin+Clinic+Patel+Nagar+Dehradun', priceRange: '₹350 – ₹900' },
    { name: 'Dr. Neha Bisht', clinic: 'Radiance Skin & Hair, Vasant Vihar, Dehradun', rating: 4.6, specialty: 'Cosmetic & Laser', googleMapsLink: 'https://maps.google.com/?q=Radiance+Skin+Hair+Vasant+Vihar+Dehradun', instagramHandle: 'radianceskindehradun', priceRange: '₹600 – ₹1,600' },
    { name: 'Dr. Arun Sharma', clinic: 'Sharma Skin Clinic, Saharanpur Road, Dehradun', rating: 4.4, specialty: 'General & Pediatric Dermatology', googleMapsLink: 'https://maps.google.com/?q=Sharma+Skin+Clinic+Saharanpur+Road+Dehradun', justDialLink: 'https://www.justdial.com/Dehradun/Sharma-Skin-Clinic-Saharanpur-Road/nct-10934512', priceRange: '₹250 – ₹700' },
  ],
  Delhi: [
    { name: 'Dr. Geetika Srivastava', clinic: 'Influennz Skin Clinic, South Delhi', rating: 4.9, specialty: 'Aesthetic Dermatology', googleMapsLink: 'https://maps.google.com/?q=Influennz+Skin+Clinic+South+Delhi', justDialLink: 'https://www.justdial.com/Delhi/Influennz-Skin-Clinic-South-Delhi/011PXX11-XX11-180312153042-B2C4_BZDET', instagramHandle: 'drgeeetika', priceRange: '₹1,500 – ₹3,000' },
    { name: 'Dr. Anil Ganjoo', clinic: "Dr. Ganjoo's Skin Clinic, Delhi", rating: 4.9, specialty: 'Dermatosurgery', googleMapsLink: 'https://maps.google.com/?q=Dr+Ganjoo+Skin+Clinic+Delhi', justDialLink: 'https://www.justdial.com/Delhi/Dr-Ganjoos-Skin-Clinic/011PXX11-XX11-150601122230-K9P7_BZDET', priceRange: '₹1,000 – ₹2,500' },
    { name: 'Dr. Lipy Gupta', clinic: 'Skin & Hair Clinic, Delhi', rating: 4.8, specialty: 'Acne & Pigmentation', googleMapsLink: 'https://maps.google.com/?q=Dr+Lipy+Gupta+Dermatologist+Delhi', instagramHandle: 'drlipygupta', priceRange: '₹800 – ₹2,000' },
    { name: 'Dr. Rohit Batra', clinic: 'DermaWorld Skin & Hair Clinic, Rajouri Garden', rating: 4.8, specialty: 'Hair Transplant & Skin', googleMapsLink: 'https://maps.google.com/?q=DermaWorld+Skin+Hair+Clinic+Rajouri+Garden+Delhi', instagramHandle: 'dermaworld_delhi', priceRange: '₹1,000 – ₹2,500' },
    { name: 'Dr. Monica Chahar', clinic: 'Skin Mantra Clinic, Pitampura, Delhi', rating: 4.7, specialty: 'Laser & Anti-Aging', googleMapsLink: 'https://maps.google.com/?q=Skin+Mantra+Clinic+Pitampura+Delhi', justDialLink: 'https://www.justdial.com/Delhi/Skin-Mantra-Clinic-Pitampura/011PXX11-XX11-190823110032-S3M5_BZDET', priceRange: '₹800 – ₹2,000' },
    { name: 'Dr. Deepali Bhardwaj', clinic: 'Skin & Hair Solutions, Green Park, Delhi', rating: 4.9, specialty: 'Cosmetic Dermatology', googleMapsLink: 'https://maps.google.com/?q=Skin+Hair+Solutions+Green+Park+Delhi', instagramHandle: 'drdeepali_bhardwaj', priceRange: '₹1,200 – ₹3,000' },
    { name: 'Dr. Niti Khunger', clinic: 'VMMC & Safdarjung Hospital, Delhi', rating: 4.7, specialty: 'Dermatosurgery & Laser', googleMapsLink: 'https://maps.google.com/?q=Safdarjung+Hospital+Dermatology+Delhi', priceRange: '₹500 – ₹1,500' },
    { name: 'Dr. Sonal Bansal', clinic: 'Whitefields Skin Clinic, Dwarka, Delhi', rating: 4.6, specialty: 'Acne Scars & Pigmentation', googleMapsLink: 'https://maps.google.com/?q=Whitefields+Skin+Clinic+Dwarka+Delhi', justDialLink: 'https://www.justdial.com/Delhi/Whitefields-Skin-Clinic-Dwarka/011PXX11-XX11-200612153210-W4F9_BZDET', priceRange: '₹700 – ₹1,800' },
    { name: 'Dr. Renu Mathur', clinic: 'Mathur Skin Clinic, Karol Bagh, Delhi', rating: 4.5, specialty: 'General Dermatology', googleMapsLink: 'https://maps.google.com/?q=Mathur+Skin+Clinic+Karol+Bagh+Delhi', priceRange: '₹400 – ₹1,000' },
    { name: 'Dr. Anurag Tiwari', clinic: 'SkinViva Clinic, Lajpat Nagar, Delhi', rating: 4.6, specialty: 'Vitiligo & Psoriasis', googleMapsLink: 'https://maps.google.com/?q=SkinViva+Clinic+Lajpat+Nagar+Delhi', instagramHandle: 'skinviva_delhi', priceRange: '₹600 – ₹1,500' },
  ],
  Mumbai: [
    { name: 'Dr. Shrilata Trasi', clinic: "Dr. Trasi's Clinic, Mumbai", rating: 4.9, specialty: 'Cosmetic Dermatology', googleMapsLink: 'https://maps.google.com/?q=Dr+Shrilata+Trasi+Clinic+Mumbai', justDialLink: 'https://www.justdial.com/Mumbai/Dr-Shrilata-Trasi-Clinic/022PXX22-XX22-140823094512-T6R1_BZDET', instagramHandle: 'drshrilatatrasi', priceRange: '₹1,200 – ₹3,000' },
    { name: 'Dr. Monica Bambroo', clinic: 'Dermato-Surgery & Skin Clinic, Mumbai', rating: 4.8, specialty: 'Dermato-Surgery', googleMapsLink: 'https://maps.google.com/?q=Dr+Monica+Bambroo+Dermatologist+Mumbai', instagramHandle: 'drmonicabambroo', priceRange: '₹1,000 – ₹2,500' },
    { name: 'Dr. Apratim Goel', clinic: 'Cutis Skin Studio, Andheri, Mumbai', rating: 4.9, specialty: 'Laser & Aesthetic Dermatology', googleMapsLink: 'https://maps.google.com/?q=Cutis+Skin+Studio+Andheri+Mumbai', instagramHandle: 'cutisskin', priceRange: '₹1,500 – ₹4,000' },
    { name: 'Dr. Rinky Kapoor', clinic: 'The Esthetic Clinics, Mumbai', rating: 4.8, specialty: 'Cosmetic & Surgical Dermatology', googleMapsLink: 'https://maps.google.com/?q=The+Esthetic+Clinics+Mumbai', instagramHandle: 'drrinkykapoor', priceRange: '₹1,500 – ₹3,500' },
    { name: 'Dr. Sejal Shah', clinic: 'SkinSpace Clinic, Bandra, Mumbai', rating: 4.7, specialty: 'Acne & Anti-Aging', googleMapsLink: 'https://maps.google.com/?q=SkinSpace+Clinic+Bandra+Mumbai', instagramHandle: 'skinspaceclinic', priceRange: '₹1,000 – ₹2,500' },
    { name: 'Dr. Harshna Bijlani', clinic: 'The AgeLess Clinic, Mumbai', rating: 4.8, specialty: 'Anti-Aging & Rejuvenation', googleMapsLink: 'https://maps.google.com/?q=The+AgeLess+Clinic+Mumbai', instagramHandle: 'drharshna', priceRange: '₹2,000 – ₹5,000' },
    { name: 'Dr. Geeta Oberoi', clinic: 'Skin Laser Centre, Borivali, Mumbai', rating: 4.6, specialty: 'Laser & Pigmentation', googleMapsLink: 'https://maps.google.com/?q=Skin+Laser+Centre+Borivali+Mumbai', justDialLink: 'https://www.justdial.com/Mumbai/Skin-Laser-Centre-Borivali/022PXX22-XX22-160712092011-S5L3_BZDET', priceRange: '₹800 – ₹2,000' },
    { name: 'Dr. Niteen Dhepe', clinic: 'Skin City, Mumbai', rating: 4.7, specialty: 'Vitiligo & Hair Loss', googleMapsLink: 'https://maps.google.com/?q=Skin+City+Mumbai', priceRange: '₹700 – ₹1,800' },
    { name: 'Dr. Shefali Trasi', clinic: 'Trasi Skin Clinic, Dadar, Mumbai', rating: 4.6, specialty: 'General & Pediatric Dermatology', googleMapsLink: 'https://maps.google.com/?q=Trasi+Skin+Clinic+Dadar+Mumbai', priceRange: '₹600 – ₹1,500' },
    { name: 'Dr. Madhuri Agarwal', clinic: 'Yavana Aesthetics, Khar, Mumbai', rating: 4.8, specialty: 'Aesthetic Dermatology', googleMapsLink: 'https://maps.google.com/?q=Yavana+Aesthetics+Khar+Mumbai', instagramHandle: 'yavana_aesthetics', priceRange: '₹1,200 – ₹3,000' },
  ],
  Bangalore: [
    { name: 'Dr. Rasya Dixit', clinic: "Dr. Dixit's Cosmetic Dermatology Clinic, Indiranagar", rating: 4.9, specialty: 'Cosmetic Dermatology', googleMapsLink: 'https://maps.google.com/?q=Dr+Dixit+Cosmetic+Dermatology+Clinic+Indiranagar+Bangalore', justDialLink: 'https://www.justdial.com/Bangalore/Dr-Dixit-Cosmetic-Dermatology-Clinic-Indiranagar/080PXX80-XX80-190501112233-R5D9_BZDET', instagramHandle: 'drrasyadixit', priceRange: '₹1,500 – ₹3,500' },
    { name: 'Dr. Nischal K', clinic: 'Oliva Skin & Hair Clinic, Koramangala', rating: 4.8, specialty: 'Hair & Scalp', googleMapsLink: 'https://maps.google.com/?q=Oliva+Skin+Hair+Clinic+Koramangala+Bangalore', instagramHandle: 'olivaclinic', priceRange: '₹1,000 – ₹2,500' },
    { name: 'Dr. Swetha Mysore', clinic: 'Skin Secrets, Jayanagar, Bangalore', rating: 4.8, specialty: 'Laser & Cosmetic Dermatology', googleMapsLink: 'https://maps.google.com/?q=Skin+Secrets+Jayanagar+Bangalore', instagramHandle: 'skinsecretsbangalore', priceRange: '₹1,000 – ₹2,800' },
    { name: 'Dr. Navya Handa', clinic: 'Dermiq Clinic, Whitefield, Bangalore', rating: 4.7, specialty: 'Acne & Pigmentation', googleMapsLink: 'https://maps.google.com/?q=Dermiq+Clinic+Whitefield+Bangalore', instagramHandle: 'dermiq_clinic', priceRange: '₹800 – ₹2,000' },
    { name: 'Dr. Deepika Lunawat', clinic: 'Dermaclinix, Koramangala, Bangalore', rating: 4.7, specialty: 'Hair Loss & Skin', googleMapsLink: 'https://maps.google.com/?q=Dermaclinix+Koramangala+Bangalore', priceRange: '₹700 – ₹1,800' },
    { name: 'Dr. Chaitra Somaiah', clinic: 'Chaitra Dermatology, HSR Layout, Bangalore', rating: 4.6, specialty: 'General & Cosmetic Dermatology', googleMapsLink: 'https://maps.google.com/?q=Chaitra+Dermatology+HSR+Layout+Bangalore', justDialLink: 'https://www.justdial.com/Bangalore/Chaitra-Dermatology-HSR-Layout/080PXX80-XX80-200712143012-C6D4_BZDET', priceRange: '₹600 – ₹1,500' },
    { name: 'Dr. Rajesh Kumar', clinic: 'Skin & Beyond Clinic, Malleshwaram, Bangalore', rating: 4.5, specialty: 'Psoriasis & Eczema', googleMapsLink: 'https://maps.google.com/?q=Skin+Beyond+Clinic+Malleshwaram+Bangalore', priceRange: '₹500 – ₹1,200' },
    { name: 'Dr. Pooja Malhotra', clinic: 'Clear Skin Clinic, Rajajinagar, Bangalore', rating: 4.6, specialty: 'Acne Scars & Laser', googleMapsLink: 'https://maps.google.com/?q=Clear+Skin+Clinic+Rajajinagar+Bangalore', instagramHandle: 'clearskinclinic_blr', priceRange: '₹700 – ₹1,800' },
    { name: 'Dr. Vandana Kumari', clinic: 'SkinGlow Clinic, BTM Layout, Bangalore', rating: 4.5, specialty: 'Anti-Aging & Botox', googleMapsLink: 'https://maps.google.com/?q=SkinGlow+Clinic+BTM+Layout+Bangalore', priceRange: '₹800 – ₹2,000' },
    { name: 'Dr. Anil Kumar S', clinic: 'Manipal Hospital Dermatology, Old Airport Road', rating: 4.8, specialty: 'Medical Dermatology', googleMapsLink: 'https://maps.google.com/?q=Manipal+Hospital+Dermatology+Old+Airport+Road+Bangalore', priceRange: '₹1,000 – ₹2,500' },
  ],
  Chennai: [
    { name: 'Dr. Vatsan V', clinic: 'WEA Clinic, Velachery', rating: 4.9, specialty: 'Dermato-Surgery & Laser', googleMapsLink: 'https://maps.google.com/?q=WEA+Clinic+Velachery+Chennai', justDialLink: 'https://www.justdial.com/Chennai/WEA-Clinic-Velachery/044PXX44-XX44-200312093011-W2A4_BZDET', priceRange: '₹700 – ₹1,800' },
    { name: 'Dr. Janani A. Palanivel', clinic: 'DC Clinic, Velachery', rating: 4.8, specialty: 'Acne & Pigmentation', googleMapsLink: 'https://maps.google.com/?q=DC+Clinic+Velachery+Chennai', instagramHandle: 'drjananipalanivel', priceRange: '₹600 – ₹1,500' },
    { name: 'Dr. Priya Agarwal', clinic: 'Oliva Skin & Hair Clinic, Anna Nagar', rating: 4.8, specialty: 'Laser & Hair Loss', googleMapsLink: 'https://maps.google.com/?q=Oliva+Skin+Hair+Clinic+Anna+Nagar+Chennai', instagramHandle: 'olivaclinic', priceRange: '₹900 – ₹2,200' },
    { name: 'Dr. Uma Shankar', clinic: 'Dr. Uma Skin Clinic, T. Nagar, Chennai', rating: 4.7, specialty: 'General Dermatology', googleMapsLink: 'https://maps.google.com/?q=Dr+Uma+Skin+Clinic+T+Nagar+Chennai', justDialLink: 'https://www.justdial.com/Chennai/Dr-Uma-Skin-Clinic-T-Nagar/044PXX44-XX44-190401112501-U3S7_BZDET', priceRange: '₹500 – ₹1,200' },
    { name: 'Dr. Meena Kumari', clinic: 'Skin Care Centre, Adyar, Chennai', rating: 4.6, specialty: 'Cosmetic Dermatology', googleMapsLink: 'https://maps.google.com/?q=Skin+Care+Centre+Adyar+Chennai', priceRange: '₹600 – ₹1,500' },
    { name: 'Dr. Karthik Rajan', clinic: 'Apollo Dermatology, Greams Road, Chennai', rating: 4.8, specialty: 'Medical & Aesthetic Dermatology', googleMapsLink: 'https://maps.google.com/?q=Apollo+Dermatology+Greams+Road+Chennai', priceRange: '₹1,000 – ₹2,500' },
    { name: 'Dr. Sudha Srinivasan', clinic: 'Radiant Skin Clinic, Porur, Chennai', rating: 4.5, specialty: 'Acne & Scar Treatment', googleMapsLink: 'https://maps.google.com/?q=Radiant+Skin+Clinic+Porur+Chennai', priceRange: '₹500 – ₹1,200' },
    { name: 'Dr. Rajiv Anand', clinic: 'DermaCure Clinic, Nungambakkam, Chennai', rating: 4.6, specialty: 'Hair & Scalp Disorders', googleMapsLink: 'https://maps.google.com/?q=DermaCure+Clinic+Nungambakkam+Chennai', justDialLink: 'https://www.justdial.com/Chennai/DermaCure-Clinic-Nungambakkam/044PXX44-XX44-210512114502-D4C8_BZDET', priceRange: '₹600 – ₹1,600' },
    { name: 'Dr. Anitha Mohan', clinic: 'Anitha Skin Clinic, Vadapalani, Chennai', rating: 4.5, specialty: 'Vitiligo & Psoriasis', googleMapsLink: 'https://maps.google.com/?q=Anitha+Skin+Clinic+Vadapalani+Chennai', priceRange: '₹400 – ₹1,000' },
    { name: 'Dr. Sathish Kumar', clinic: 'SkinPlus Clinic, Sholinganallur, Chennai', rating: 4.6, specialty: 'Laser & Pigmentation', googleMapsLink: 'https://maps.google.com/?q=SkinPlus+Clinic+Sholinganallur+Chennai', instagramHandle: 'skinplus_chennai', priceRange: '₹700 – ₹1,800' },
  ],
  Hyderabad: [
    { name: 'Oliva Skin & Hair Clinic', clinic: 'Oliva Clinics, Banjara Hills', rating: 4.9, specialty: 'Medical Dermatology', googleMapsLink: 'https://maps.google.com/?q=Oliva+Skin+Hair+Clinic+Banjara+Hills+Hyderabad', justDialLink: 'https://www.justdial.com/Hyderabad/Oliva-Clinic-Banjara-Hills/040PXX40-XX40-170823141512-O3L6_BZDET', instagramHandle: 'olivaclinic', priceRange: '₹900 – ₹2,200' },
    { name: 'Oliva Skin & Hair Clinic', clinic: 'Oliva Clinics, Jubilee Hills', rating: 4.8, specialty: 'Laser & Anti-Aging', googleMapsLink: 'https://maps.google.com/?q=Oliva+Skin+Hair+Clinic+Jubilee+Hills+Hyderabad', instagramHandle: 'olivaclinic', priceRange: '₹900 – ₹2,200' },
    { name: 'Dr. Swetha Harikumar', clinic: 'Cutis Skin Clinic, Madhapur, Hyderabad', rating: 4.8, specialty: 'Cosmetic Dermatology', googleMapsLink: 'https://maps.google.com/?q=Cutis+Skin+Clinic+Madhapur+Hyderabad', instagramHandle: 'cutisskin_hyd', priceRange: '₹1,000 – ₹2,500' },
    { name: 'Dr. Preethi S', clinic: 'Dermaclinix, Kondapur, Hyderabad', rating: 4.7, specialty: 'Hair Loss & Acne', googleMapsLink: 'https://maps.google.com/?q=Dermaclinix+Kondapur+Hyderabad', priceRange: '₹700 – ₹1,800' },
    { name: 'Dr. Kavitha Reddy', clinic: 'Aesthetica Skin Clinic, Himayatnagar', rating: 4.8, specialty: 'Aesthetic & Laser Dermatology', googleMapsLink: 'https://maps.google.com/?q=Aesthetica+Skin+Clinic+Himayatnagar+Hyderabad', instagramHandle: 'aestheticaskinclinic', priceRange: '₹1,000 – ₹2,500' },
    { name: 'Dr. Vijay Kumar', clinic: 'SkinCure Clinic, KPHB Colony, Hyderabad', rating: 4.5, specialty: 'General Dermatology', googleMapsLink: 'https://maps.google.com/?q=SkinCure+Clinic+KPHB+Colony+Hyderabad', justDialLink: 'https://www.justdial.com/Hyderabad/SkinCure-Clinic-KPHB/040PXX40-XX40-190512100011-S6K2_BZDET', priceRange: '₹400 – ₹1,000' },
    { name: 'Dr. Archana Prasad', clinic: 'Archana Skin Clinic, Kukatpally, Hyderabad', rating: 4.6, specialty: 'Acne & Pigmentation', googleMapsLink: 'https://maps.google.com/?q=Archana+Skin+Clinic+Kukatpally+Hyderabad', priceRange: '₹500 – ₹1,200' },
    { name: 'Dr. Roja Ramani', clinic: 'Roja Skin Centre, Miyapur, Hyderabad', rating: 4.5, specialty: 'Psoriasis & Eczema', googleMapsLink: 'https://maps.google.com/?q=Roja+Skin+Centre+Miyapur+Hyderabad', priceRange: '₹400 – ₹1,000' },
    { name: 'Dr. Suresh Babu', clinic: 'Apollo Dermatology, Jubilee Hills, Hyderabad', rating: 4.8, specialty: 'Medical & Cosmetic Dermatology', googleMapsLink: 'https://maps.google.com/?q=Apollo+Dermatology+Jubilee+Hills+Hyderabad', priceRange: '₹1,200 – ₹3,000' },
    { name: 'Dr. Padmaja Yanamandra', clinic: 'Skin & Aesthetics, Tolichowki, Hyderabad', rating: 4.6, specialty: 'Laser & Rejuvenation', googleMapsLink: 'https://maps.google.com/?q=Skin+Aesthetics+Tolichowki+Hyderabad', justDialLink: 'https://www.justdial.com/Hyderabad/Skin-Aesthetics-Tolichowki/040PXX40-XX40-200812130011-P4Y3_BZDET', priceRange: '₹700 – ₹1,800' },
  ],
  Pune: [
    { name: 'Dr. Anil Patki', clinic: 'Skin & Surgery International, Pune', rating: 4.9, specialty: 'General Dermatology', googleMapsLink: 'https://maps.google.com/?q=Skin+Surgery+International+Pune', justDialLink: 'https://www.justdial.com/Pune/Skin-Surgery-International-Pune/020PXX20-XX20-150601100200-S9K3_BZDET', instagramHandle: 'skinandsurgery_pune', priceRange: '₹700 – ₹1,800' },
    { name: 'Dr. Sunil Tolat', clinic: 'Tolat Skin Clinic, Pune', rating: 4.8, specialty: 'Cosmetic & Medical', googleMapsLink: 'https://maps.google.com/?q=Dr+Sunil+Tolat+Skin+Clinic+Pune', instagramHandle: 'tolatskinclinic', priceRange: '₹600 – ₹1,500' },
    { name: 'Dr. Anuja Deshmukh', clinic: 'Skin Glow Clinic, Kothrud, Pune', rating: 4.7, specialty: 'Laser & Pigmentation', googleMapsLink: 'https://maps.google.com/?q=Skin+Glow+Clinic+Kothrud+Pune', instagramHandle: 'skinglowpune', priceRange: '₹700 – ₹1,800' },
    { name: 'Dr. Meenal Khare', clinic: 'Meenal Skin Clinic, Viman Nagar, Pune', rating: 4.6, specialty: 'Acne & Anti-Aging', googleMapsLink: 'https://maps.google.com/?q=Meenal+Skin+Clinic+Viman+Nagar+Pune', justDialLink: 'https://www.justdial.com/Pune/Meenal-Skin-Clinic-Viman-Nagar/020PXX20-XX20-200512112001-M3K7_BZDET', priceRange: '₹500 – ₹1,300' },
    { name: 'Dr. Shweta Joshi', clinic: 'Shweta Skin Care, Baner, Pune', rating: 4.7, specialty: 'Cosmetic Dermatology', googleMapsLink: 'https://maps.google.com/?q=Shweta+Skin+Care+Baner+Pune', priceRange: '₹600 – ₹1,500' },
    { name: 'Dr. Rahul Mahajan', clinic: 'DermaPure, Wakad, Pune', rating: 4.5, specialty: 'Hair Loss & Scalp', googleMapsLink: 'https://maps.google.com/?q=DermaPure+Wakad+Pune', priceRange: '₹500 – ₹1,200' },
    { name: 'Dr. Pallavi Sule', clinic: 'ClearSkin Clinic, Aundh, Pune', rating: 4.8, specialty: 'Acne Scars & Laser', googleMapsLink: 'https://maps.google.com/?q=ClearSkin+Clinic+Aundh+Pune', instagramHandle: 'clearskin_pune', priceRange: '₹800 – ₹2,000' },
    { name: 'Dr. Nitin Borkar', clinic: 'Borkar Skin Centre, Shivajinagar, Pune', rating: 4.5, specialty: 'Psoriasis & Vitiligo', googleMapsLink: 'https://maps.google.com/?q=Borkar+Skin+Centre+Shivajinagar+Pune', justDialLink: 'https://www.justdial.com/Pune/Borkar-Skin-Centre-Shivajinagar/020PXX20-XX20-180312141001-B5N2_BZDET', priceRange: '₹400 – ₹1,000' },
    { name: 'Dr. Smita Yadav', clinic: 'Smita Skin Clinic, Hadapsar, Pune', rating: 4.5, specialty: 'General & Pediatric Dermatology', googleMapsLink: 'https://maps.google.com/?q=Smita+Skin+Clinic+Hadapsar+Pune', priceRange: '₹400 – ₹900' },
    { name: 'Dr. Amol Gosavi', clinic: 'Gosavi Dermatology, Katraj, Pune', rating: 4.6, specialty: 'Laser & Aesthetic Dermatology', googleMapsLink: 'https://maps.google.com/?q=Gosavi+Dermatology+Katraj+Pune', instagramHandle: 'gosaviDermatology', priceRange: '₹600 – ₹1,500' },
  ],
};

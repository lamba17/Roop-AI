import AppLayout from '../components/AppLayout';
import MakeupArtistFinder from '../components/MakeupArtistFinder';

export default function MakeupArtists() {
  return (
    <AppLayout>
      <div className="page-specialists fade-in">
        <MakeupArtistFinder />
      </div>
    </AppLayout>
  );
}

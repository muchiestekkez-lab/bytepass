import FlightForm from '@/components/flights/FlightForm';

export const metadata = { title: 'Log Flight — Cloud Trip' };

export default function NewFlightPage() {
  return (
    <div className="max-w-lg animate-fade-in">
      <h1 className="font-display text-3xl font-black text-slate-800 mb-2">Log a Flight ✈️</h1>
      <p className="text-slate-500 mb-8">
        Where are you headed on the internet? Be honest.
      </p>
      <div className="bg-white/80 backdrop-blur-sm border border-white/60 rounded-3xl shadow-card p-8">
        <FlightForm />
      </div>
    </div>
  );
}

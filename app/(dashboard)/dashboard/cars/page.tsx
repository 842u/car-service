import { AddCarButton } from '@/components/ui/AddCarButton/AddCarButton';

export default function CarsPage() {
  return (
    <main className="flex h-screen flex-col items-center justify-center">
      <AddCarButton className="fixed right-0 bottom-0 m-4 md:m-8 lg:m-12" />
    </main>
  );
}

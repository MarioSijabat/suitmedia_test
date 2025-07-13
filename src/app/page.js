import IdeasList from '@/components/IdeasList';
import Header from '@/components/Header';
import Banner from '@/components/Banner';
import Image from 'next/image';

export default function Home() {
  const bannerData = {
    imageUrl: '/images/banner.jpg',
    title: 'Ideas',
    subtitle: 'Where all our great things begin',
  };

  return (
    <main className="container mx-auto bg-white">
      <Header />
      <Banner {...bannerData} />
      <IdeasList />
    </main>
  );
}
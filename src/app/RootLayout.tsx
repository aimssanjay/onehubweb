import { Outlet } from 'react-router';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { MobileBottomBar } from './components/MobileBottomBar';

export default function RootLayout() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main className="pb-[72px] md:pb-0">
        <Outlet />
      </main>
      <Footer />
      <MobileBottomBar />
    </>
  );
}

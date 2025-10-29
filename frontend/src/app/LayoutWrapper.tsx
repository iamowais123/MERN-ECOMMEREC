"use client"; // Ye batata hai ki ye component client-side (browser) me chalega, not server-side

// Loader component import kar rahe hain (ye loading dikhata hai jab tak data ready nahi hota)
import Loader from "@/lib/BookLoader";

// AuthChecker ek custom component hai jo user authentication check karta hai
import AuthChecker from "@/store/Provider/AuthProvider";

// Redux store aur persistor import kar rahe hain (store global data rakhta hai, persistor usse save karta hai)
import { persistor, store } from "@/store/store";

// Provider redux ka hota hai — iske andar pura app wrap karte hain taaki sab jagah Redux ka data mil sake
import { Provider } from "react-redux";

// PersistGate Redux Persist ka hota hai — jab tak localStorage se data load nahi hota tab tak loader dikhata hai
import { PersistGate } from 'redux-persist/integration/react';

// react-hot-toast ka Toaster import kar rahe hain — ye notifications dikhata hai (success/error messages)
import { Toaster } from 'react-hot-toast';

// usePathname hook Next.js ka hota hai — current URL path batata hai (jaise /home, /admin, etc.)
import { usePathname } from "next/navigation";

// Header aur Footer import kar rahe hain — ye UI ke top aur bottom parts hain
import Header from "./components/Header";
import Footer from "./components/Footer";

// LayoutWrapper ek wrapper component hai jo pura app ke layout ko manage karta hai
export default function LayoutWrapper({ children }: { children: React.ReactNode }) {

  // Current path (route) nikal rahe hain
  const pathname = usePathname();

  // Check kar rahe hain ki kya current path "/admin" se start hota hai
  // Agar haan, to ye admin route hai (aur hum header/footer nahi dikhayenge)
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    // Redux Provider: iske andar pura app aata hai, taaki sab jagah Redux store use ho sake
    <Provider store={store}>

      {/* PersistGate: jab tak Redux Persist localStorage se data la raha hota hai tab tak Loader dikhata hai */}
      <PersistGate loading={<Loader />} persistor={persistor}>

        {/* Toaster: ye notifications dikhata hai (jaise toast.success("Logged in!")) */}
        <Toaster />

        {/* AuthChecker: ye check karta hai ki user login hai ya nahi, aur accordingly access allow karta hai */}
        <AuthChecker>

          {/* Agar admin route nahi hai to Header aur Footer dikhana hai */}
          {!isAdminRoute && <Header />}

          {/* Ye app ka main content hai (page ke children) */}
          {children}

          {/* Footer sirf tab dikhayenge jab admin route nahi ho */}
          {!isAdminRoute && <Footer />}

        </AuthChecker>

      </PersistGate>
    </Provider>
  );
}

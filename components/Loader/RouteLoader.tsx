// // components/RouteLoader.tsx
// "use client";

// import { usePathname, useRouter } from "next/navigation";
// import { useEffect } from "react";
// import { useLoader } from "@/components/Loader/LoaderContext";

// export default function RouteLoader() {
//   const router = useRouter();
//   const pathname = usePathname();
//   const { showLoader, hideLoader } = useLoader();

//   useEffect(() => {
//     // Show loader whenever pathname changes
//     showLoader();
//     const timeout = setTimeout(() => hideLoader(), 300); // small delay for visual effect
//     return () => clearTimeout(timeout);
//   }, [pathname]);

//   return null;
// }

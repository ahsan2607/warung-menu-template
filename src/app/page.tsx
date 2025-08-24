// app/menu/page.tsx (server component by default)
import MenuTemplate from "@/components/menu/MenuTemplate";
import { Suspense } from "react";

export default function MenuPage() {
  return (
      <Suspense fallback={<div>Loading...</div>}>
        <MenuTemplate />
      </Suspense>
  );
}

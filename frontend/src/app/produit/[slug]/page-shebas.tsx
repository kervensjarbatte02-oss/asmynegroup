"use client";
import HairSolutionsNavbar from "../../services/hair-solutions/HairSolutionsNavbar";
import FooterSection from "../../services/hair-solutions/FooterSection";
import ProductInfoSection from "./ProductInfoSection";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <div className="min-h-screen bg-yellow-50 flex flex-col">
      <HairSolutionsNavbar />
      <main className="flex-1 flex flex-col">
        <ProductInfoSection slug={slug} />
      </main>
      <FooterSection />
    </div>
  );
}

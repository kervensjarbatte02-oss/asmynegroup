
import HairSolutionsNavbar from "../../services/hair-solutions/HairSolutionsNavbar";
import FooterSection from "../../services/hair-solutions/FooterSection";
import Navbar from "../../services/marketplace-global/Navbar";
import Footer from "../../PageFooter";
import ProductInfoSection from "./ProductInfoSection";
import { redirect } from "next/navigation";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slug || slug === "undefined") {
    redirect("/");
  }
  const isShebas = slug.startsWith("shebas-");
  return (
    <div className="min-h-screen bg-yellow-50 flex flex-col">
      {isShebas ? <HairSolutionsNavbar /> : <Navbar />}
      <main className="flex-1 flex flex-col px-4">
        <ProductInfoSection slug={slug} />
      </main>
      {isShebas ? <FooterSection /> : <Footer />}
    </div>
  );
}

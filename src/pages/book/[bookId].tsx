import Layout from "@/features/Layout";
import BookPage, { footerElements } from "@/features/pages/Book";

export default function BookByIdPage() {
  return (
    <Layout footerELements={footerElements}>
      <BookPage />
    </Layout>
  );
}

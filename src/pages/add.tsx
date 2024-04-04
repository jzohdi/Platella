import Layout from "@/features/Layout";
import AddBookPage, { addBookFooterActions } from "@/features/pages/AddBook";

export default function AddBook() {
  return (
    <Layout footerELements={addBookFooterActions}>
      <AddBookPage />
    </Layout>
  );
}

import Layout from "@/features/Layout";
import Library, { libraryFooterActions } from "@/features/pages/Library";

export default function Home() {
  return (
    <Layout footerELements={libraryFooterActions}>
      <Library />
    </Layout>
  );
}

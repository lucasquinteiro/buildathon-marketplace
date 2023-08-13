import Store from "@/modules/Store";

const StorePage = ({ params }: { params: { id: string } }) => {
  return <Store storeID={Number(params.id)} />;
};

export default StorePage;

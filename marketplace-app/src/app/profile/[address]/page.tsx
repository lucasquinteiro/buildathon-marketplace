import Purchases from "@/modules/Profile/Purchases";

const ProfilePage = ({ params }: { params: { address: string } }) => {
  return (
    <div className="px-12 py-24">
      <Purchases address={params.address} />
    </div>
  );
};

export default ProfilePage;

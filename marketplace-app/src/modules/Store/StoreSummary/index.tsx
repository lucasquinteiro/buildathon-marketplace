import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import Store from "@/types/Store";
import Link from "next/link";

const StoreSummary: React.FC<Store> = ({ storeID, name, imagePath }) => {
  return (
    <Link href={`/store/${storeID}`}>
      <div className="flex flex-row items-center gap-3 w-fit">
        <Avatar className="w-6 h-6 rounded-full">
          <AvatarImage src={`/stores/${imagePath}`} />
          <AvatarFallback>{`SU`}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1 overflow-hidden">
          <p className="text-white">{name}</p>{" "}
        </div>
      </div>
    </Link>
  );
};

export default StoreSummary;

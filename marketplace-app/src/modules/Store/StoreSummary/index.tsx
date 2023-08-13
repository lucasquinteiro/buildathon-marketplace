import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import Store from "@/types/Store";
import Link from "next/link";

const StoreSummary: React.FC<Store> = ({ storeID, name, imagePath }) => {
  return (
    <Link href={`/store/${storeID}`}>
      <Card className="flex flex-row items-center max-w-full gap-4 p-2 cursor-pointer hover:opacity-80">
        <Avatar className="w-12 h-12">
          <AvatarImage src={`/stores/${imagePath}`} />
          {/* <AvatarFallback>{`${name[0].toUpperCase()}${name[1].toUpperCase()}`}</AvatarFallback> */}
          <AvatarFallback>{`SU`}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1 overflow-hidden">
          <p className="text-sm font-bold">{name}</p>
          {/* <span className="overflow-hidden text-xs text-ellipsis">{address}</span> */}
        </div>
      </Card>
    </Link>
  );
};

export default StoreSummary;

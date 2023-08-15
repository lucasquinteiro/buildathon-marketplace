import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import Store from "@/types/Store";
import Link from "next/link";

const StoreSummary: React.FC<Store> = ({ storeID, name, imagePath }) => {
  return (
    <Link href={`/store/${storeID}`}>
      <Card className="flex flex-row items-center max-w-full gap-4 p-2 mt-0 cursor-pointer hover:opacity-80 bg-transparent border-none">
        <Avatar className="w-12 h-12 rounded-full"> {/* Added rounded-full for circular image */}
          <AvatarImage src={`/stores/${imagePath}`} />
          <AvatarFallback>{`SU`}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1 overflow-hidden">
          <p className="text-sm font-bold text-white">{name}</p> {/* Added text-white for white text */}
        </div>
      </Card>
    </Link>
  );
};

export default StoreSummary;

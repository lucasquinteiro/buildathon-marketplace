import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

const StoreSummary: React.FC<Store> = ({ address, name, imageUrl }) => {
  return (
    <Card className="flex flex-row items-center max-w-full gap-4 p-2 cursor-pointer hover:opacity-80">
      <Avatar className="w-12 h-12">
        <AvatarImage src={imageUrl} />
        {/* <AvatarFallback>{`${name[0].toUpperCase()}${name[1].toUpperCase()}`}</AvatarFallback> */}
        <AvatarFallback>{`SU`}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-1 overflow-hidden">
        <p className="text-sm font-bold">{name}</p>
        {/* <span className="overflow-hidden text-xs text-ellipsis">{address}</span> */}
      </div>
    </Card>
  );
};

export default StoreSummary;

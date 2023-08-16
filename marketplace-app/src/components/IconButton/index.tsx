"use client";

import Image from "next/image";

interface Props {
  onClick?: () => void;
  icon: string;
}

const IconButton: React.FC<Props> = ({ icon, onClick }) => {
  return (
    <button className="p-2 rounded-md bg-primary" onClick={onClick}>
      <Image
        src={`/icons/${icon}.svg`}
        alt="icon-butt"
        width={30}
        height={30}
      />
    </button>
  );
};

export default IconButton;

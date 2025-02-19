import { FC } from "react";
import Avatar from "boring-avatars";

interface ILayoutHeaderProps {
  title: string;
  username?: string;
}

export const LayoutHeader: FC<ILayoutHeaderProps> = ({ title, username = "user" }) => {
  return (
    <div className="text-white p-4 flex justify-between items-center border-b border-gray-800/50">
      <h1 className="font-semibold text-xl">{title}</h1>
      <div className="h-10 w-10 rounded-full overflow-hidden">
        <Avatar
          size={40}
          name={username}
          variant="marble"
          colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
        />
      </div>
    </div>
  );
};

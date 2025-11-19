import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserStore } from "@/stores/useAuthStore";

function UserProfile() {
  const { user } = useUserStore();
  return (
    <div className="font-quicksand text-base-black flex items-center gap-4 px-4 text-left text-base leading-[100%] font-bold tracking-[0%] lg:px-8">
      <Avatar className="size-[60px]">
        {<AvatarImage src={user?.avatar} alt={user?.name} />}
        <AvatarFallback className="bg-base-blue-cream text-2xl font-medium">
          {(user?.name
            ? user.name
                .split(" ")
                .map((w) => w[0])
                .join("")
            : "N/A"
          )
            ?.toUpperCase()
            .slice(0, 2)}
        </AvatarFallback>
      </Avatar>
      <div className="grid flex-1 gap-1 text-left leading-tight">
        <h1 className="truncate">Hello, Mr. {user?.name}</h1>
        <p className="text-base-gray truncate font-medium">
          Welcome to Limospro Dashboard
        </p>
      </div>
    </div>
  );
}

export default UserProfile;

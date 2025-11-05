import { user } from "@/components/layouts/partials/app-sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

function UserProfile() {
  return (
    <div className="font-quicksand text-base-black flex items-center gap-4 px-4 text-left text-base leading-[100%] font-bold tracking-[0%] lg:px-8">
      <Avatar className="h-[60px] w-[60px] rounded-full">
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback className="bg-base-blue-cream text-2xl font-medium">
          {user.name?.[0] ?? "N/A"}
        </AvatarFallback>
      </Avatar>
      <div className="grid flex-1 gap-1 text-left leading-tight">
        <h1 className="truncate">Hello, Mr. {user.name}</h1>
        <p className="text-base-gray truncate font-medium">Welcome to Limospro Dashboard</p>
      </div>
    </div>
  )
}

export default UserProfile

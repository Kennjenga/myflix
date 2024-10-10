import { User, Phone, Mail, Briefcase, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface User {
  user_id: number;
  username: string;
  phone_number: string;
  firstname: string;
  lastname: string;
  name: string;
  email: string;
  role: string;
}

const Profile = ({ user }: { user: User }) => {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex flex-col items-center space-y-4 mb-8">
        <Avatar className="w-32 h-32 border-4 border-primary">
          <AvatarImage
            src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.username}`}
            alt={user.name}
          />
          <AvatarFallback className="text-3xl">
            {user.firstname[0]}
            {user.lastname[0]}
          </AvatarFallback>
        </Avatar>
        <h1 className="text-3xl font-bold">{user.name}</h1>
        <div className="flex items-center text-muted-foreground">
          <MapPin className="w-4 h-4 mr-1" />
          <span>New York, USA</span>
        </div>
      </div>

      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileSection title="Personal Information">
              <ProfileItem icon={User} label="Username" value={user.username} />
              <ProfileItem
                icon={User}
                label="First Name"
                value={user.firstname}
              />
              <ProfileItem
                icon={User}
                label="Last Name"
                value={user.lastname}
              />
            </ProfileSection>

            <ProfileSection title="Contact Information">
              <ProfileItem
                icon={Phone}
                label="Phone Number"
                value={user.phone_number}
              />
              <ProfileItem icon={Mail} label="Email" value={user.email} />
            </ProfileSection>

            <ProfileSection title="Account Details">
              <ProfileItem
                icon={User}
                label="User ID"
                value={user.user_id.toString()}
              />
              <ProfileItem icon={Briefcase} label="Role" value={user.role} />
            </ProfileSection>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const ProfileSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold text-primary">{title}</h2>
    <Separator className="my-2" />
    <div className="space-y-3">{children}</div>
  </div>
);

const ProfileItem = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) => (
  <div className="flex items-center space-x-3">
    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
      <Icon className="w-5 h-5 text-primary" />
    </div>
    <div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  </div>
);

export default Profile;

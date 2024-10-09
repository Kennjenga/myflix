import React from "react";
interface User {
  name: string;
  role: string;
}

const Profile = ({ user }: { user: User }) => (
  <div>Profile Content {user.name}</div>
);
const EditProfile = () => <div>Edit Profile Content</div>;
const Subscriptions = () => <div>Subscriptions Content</div>;
const Back = () => <div>Back Content</div>;
const Logout = () => <div>Logout Content</div>;
const DeleteAccount = () => <div>Delete Account Content</div>;
const AllUsers = () => <div>All Users Content</div>;
const UpdateContent = () => <div>Update Content</div>;
const AllSubscriptions = () => <div>All Subscriptions Content</div>;

interface DashboardProps {
  user: User;
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [activeComponent, setActiveComponent] = React.useState(null);
  const handleComponentChange = (component: React.ReactNode) => {
    if (component) {
      setActiveComponent(component as any);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <aside style={{ width: "200px", borderRight: "1px solid #ccc" }}>
        {user.role !== "admin" ? (
          <>
            <button
              onClick={() => handleComponentChange(<Profile user={user} />)}
            >
              Profile
            </button>
            <button onClick={() => handleComponentChange(<EditProfile />)}>
              Edit Profile
            </button>
            <button onClick={() => handleComponentChange(<Subscriptions />)}>
              Subscriptions
            </button>
            <button onClick={() => handleComponentChange(<Back />)}>
              Back
            </button>
            <button onClick={() => handleComponentChange(<Logout />)}>
              Logout
            </button>
            <button onClick={() => handleComponentChange(<DeleteAccount />)}>
              Delete Account
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => handleComponentChange(<Profile user={user} />)}
            >
              Profile
            </button>
            <button onClick={() => handleComponentChange(<EditProfile />)}>
              Edit Profile
            </button>
            <button onClick={() => handleComponentChange(<Subscriptions />)}>
              Subscriptions
            </button>
            <button onClick={() => handleComponentChange(<Back />)}>
              Back
            </button>
            <button onClick={() => handleComponentChange(<Logout />)}>
              Logout
            </button>
            <button onClick={() => handleComponentChange(<DeleteAccount />)}>
              Delete Account
            </button>
            <button onClick={() => handleComponentChange(<AllUsers />)}>
              All Users
            </button>
            <button onClick={() => handleComponentChange(<UpdateContent />)}>
              Update Content
            </button>
            <button onClick={() => handleComponentChange(<AllSubscriptions />)}>
              All Subscriptions
            </button>
          </>
        )}
      </aside>
      <main style={{ padding: "20px" }}>{activeComponent}</main>
    </div>
  );
};

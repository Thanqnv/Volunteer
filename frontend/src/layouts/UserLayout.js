import UserNavbar from "@/components/user/navbar";

const UserLayout = ({ children }) => {
    return (
        <div className="flex flex-row relative">
            <div className="fixed top-0">
                <UserNavbar />
            </div>
            {children}
        </div>
    );
};

export default UserLayout;

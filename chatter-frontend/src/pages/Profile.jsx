import UserProfile from '../components/UserProfile'

export default function Profile() {
    return (
        <div className="flex-1 p-8 overflow-y-auto bg-[#242424]">
            <h1 className="text-2xl font-bold text-white mb-6">My Profile</h1>
            <div className="flex justify-center">
                <UserProfile />
            </div>
        </div>
    )
}

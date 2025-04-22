import AuthenticatedNavbar from "@/components/custom/AuthenticatedNavbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Info from "./Info";
import Account from "./Account";
const ProfilePage = () => {
  
  return (
    <>
      <AuthenticatedNavbar />
      <div className="mt-12 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences.</p>
        </div>

        <div className="card p-4">
          <Tabs defaultValue="info" className="w-full">
          <TabsList>
            <TabsTrigger value="info">Personal Info</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>
          <TabsContent value="info">
            <Info />
          </TabsContent>
          <TabsContent value="account">
            <Account />
          </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}

export default ProfilePage

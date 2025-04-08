import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
const Courses = () => {
  return (
    <div className="mt-20">
        <Tabs defaultValue="account" className="w-full">
            <TabsList className="w-1/2 ml-10">
                <TabsTrigger value="account">Home</TabsTrigger>
                <TabsTrigger value="password">My Learning</TabsTrigger>
                <TabsTrigger value="degrees">Online Degrees</TabsTrigger>
                <TabsTrigger value="careers">Careers</TabsTrigger>
            </TabsList>
            <TabsContent value="account" className="mx-10">Make changes to your account here.</TabsContent>
            <TabsContent value="password" className="mx-10">Change your password here.</TabsContent>
            <TabsContent value="degrees" className="mx-10">Get online degrees here.</TabsContent>
            <TabsContent value="careers" className="mx-10">Find your next career here.</TabsContent>
        </Tabs>

    </div>
  )
}

export default Courses
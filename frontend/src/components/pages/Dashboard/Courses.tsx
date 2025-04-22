import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const Courses = () => {
  return (
    <div className="mt-20 px-4">
      <Tabs defaultValue="account" className="w-full">
        <div className="overflow-x-auto scrollbar-hide">
          <TabsList className="flex w-max space-x-4 px-4 ">
            <TabsTrigger value="account">Home</TabsTrigger>
            <TabsTrigger value="password">My Learning</TabsTrigger>
            <TabsTrigger value="degrees">Online Quizs</TabsTrigger>
            <TabsTrigger value="careers">Careers</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="account" className="mx-4 mt-6">
          Make changes to your account here.
        </TabsContent>
        <TabsContent value="password" className="mx-4 mt-6">
          Change your password here.
        </TabsContent>
        <TabsContent value="degrees" className="mx-4 mt-6">
          Get Online Quizs here.
        </TabsContent>
        <TabsContent value="careers" className="mx-4 mt-6">
          Find your next career here.
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Courses

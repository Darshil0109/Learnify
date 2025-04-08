import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

const Features = () => {
  return (
    <div className="flex flex-col items-center justify-center py-2 px-12 lg:px-[10%] w-full mb-12">
        <span className="text-3xl font-extrabold mb-16">Features</span>
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-evenly">
            <Card className="sm:w-1/3">
                <CardHeader className="w-full ">
                    <CardTitle className="flex items-center gap-4">
                        <img src="course_feature.png" alt="" className="h-40 w-full"/>
                    </CardTitle>
                    <CardDescription className="font-bold text-xl text-center text-gray-800">Variety of Courses</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center text-gray-600">
                    <p>“Endless learning opportunities - something for everyone!”</p>
                </CardContent>
            </Card>
            <Card className="sm:w-1/3">
                <CardHeader className="w-full ">
                    <CardTitle className="flex items-center gap-4">
                        <img src="cleanUI_feature.png" alt="" className="h-40 w-full"/>
                    </CardTitle>
                    <CardDescription className="font-bold text-xl text-center text-gray-800">Clean & Better UI</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center text-gray-600">
                    <p>“Clear, welcoming layout with concise information.”</p>
                </CardContent>
            </Card>
            <Card className="sm:w-1/3">
                <CardHeader className="w-full ">
                    <CardTitle className="flex items-center gap-4">
                        <img src="responsive_feature.png" alt="" className="h-40 w-full"/>
                    </CardTitle>
                    <CardDescription className="font-bold text-xl text-center text-gray-800">Responsive Design</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center text-gray-600">
                    <p>“Guarantees a seamless experience across all devices.”</p>
                </CardContent>
            </Card>
        </div>
    </div>
  )
}

export default Features
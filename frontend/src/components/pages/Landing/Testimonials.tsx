import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"
const Testimonials = () => {
  return (
    <div className="flex flex-col items-center justify-center py-2 px-12 lg:px-[10%] w-full mb-12">
        <span className="text-3xl font-extrabold mb-16">What Our Learners say</span>
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-evenly">
            <Card className="sm:w-1/4">
                <div className="flex w-full px-4">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <CardHeader className="w-[70%]">
                        <CardTitle className="flex items-center gap-4">
                            Darshil Patel
                        </CardTitle>
                        <CardDescription>Designer</CardDescription>
                    </CardHeader>
                </div>
                <CardContent>
                    <p>“Learnify offers a clean, user-friendly interface with powerful tools for course management. Whether you’re teaching or learning, our goal is to provide a smooth, hassle-free experience.”</p>
                </CardContent>
            </Card>
            <Card className="sm:w-1/4">
                <div className="flex w-full px-4">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <CardHeader className="w-[70%]">
                        <CardTitle className="flex items-center gap-4">
                            Darshil Patel
                        </CardTitle>
                        <CardDescription>Owner</CardDescription>
                    </CardHeader>
                </div>
                <CardContent>
                    <p>“At Learnify, we’re dedicated to providing a streamlined learning experience. Our platform is built to simplify course creation, management, and sales, making it accessible for both educators and learners.”</p>
                </CardContent>
            </Card>
            <Card className="sm:w-1/4">
                <div className="flex w-full px-4">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <CardHeader className="w-[70%]">
                        <CardTitle className="flex items-center gap-4">
                            Darshil Patel
                        </CardTitle>
                        <CardDescription>Developer</CardDescription>
                    </CardHeader>
                </div>
                <CardContent>
                    <p>“Learnify is all about making online learning simple and efficient. Whether you’re creating courses or enrolling in them, our platform keeps the process smooth and accessible.”</p>
                </CardContent>
            </Card>
        </div>
    </div>
  )
}

export default Testimonials;
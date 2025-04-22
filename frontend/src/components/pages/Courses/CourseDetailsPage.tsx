import type React from "react"
// import { useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Star, Clock, BarChart, BookOpen } from "lucide-react"
import AuthenticatedNavbar from "@/components/custom/AuthenticatedNavbar"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import api from "@/axios/api"
// Types
interface Instructor {
  user_id: number
  name: string
  profile_image: string
}

interface Module {
  module_id: number
  course_id: number
  module_name: string
}

interface Lesson {
  lesson_id: number
  course_id : number
  title: string
  content: string
  video_url : string
  module_id : number
}

// interface Review {
//   id: string
//   user: {
//     name: string
//     avatar: string
//   }
//   rating: number
//   comment: string
//   date: string
// }

type Course = {
  course_id: number
  title: string
  description: string
  course_thumbnail: string
  category: string
  difficulty: string
  course_duration:string
  owner_id: number
  created_at:string
  course_price : string
}


// Helper component for star ratings
// const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
//   return (
//     <div className="flex items-center">
//       {[...Array(5)].map((_, i) => (
//         <Star
//           key={i}
//           className={`h-4 w-4 ${
//             i < Math.floor(rating)
//               ? "text-yellow-400 fill-yellow-400"
//               : i < rating
//                 ? "text-yellow-400 fill-yellow-400 opacity-50"
//                 : "text-gray-300"
//           }`}
//         />
//       ))}
//       <span className="ml-2 text-sm font-medium">{rating.toFixed(1)}</span>
//     </div>
//   )
// }

// Main component
const CourseDetailsPage: React.FC = () => {
//   const [activeModule, setActiveModule] = useState<string | undefined>(undefined)
  const [courseData, setCourseData] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const handleEnroll = () => {
    toast("Enrollment Successfull")
  }
  const { courseId } = useParams();
  useEffect(()=>{
    const fetchCourseData = async () => {
      try {
        const response = await api.get(`/api/courses/course/${courseId}`);
        const lessonAndModuleResponse = await api.get(`/api/courses/course/lessons/${courseId}`);
        if (response.status !== 200) {
          throw new Error("Failed to fetch course data");
        }
        const data = response.data;
        
        const userResponse = await api.get(`/api/users/user/${data[0].owner_id}`);
        if (userResponse.status !== 200) {
          throw new Error("Failed to fetch user data");
        }
        const userData = userResponse.data;        
        setInstructor(userData);
        setCourseData(data[0]);
        setModules(lessonAndModuleResponse.data.modules);
        setLessons(lessonAndModuleResponse.data.lessons);
        // setCourseData(data); // Assuming you have a state to set the course data
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch course data");
      }
    }
    fetchCourseData()
  },[])
  return (
    <div className="min-h-screen bg-white">
      <AuthenticatedNavbar/>

      <main className="mx-auto p-8 mt-12">
        {/* Course Hero Section */}
        <div className="mb-10 grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                {courseData?.category}
              </Badge>
              <Badge variant="outline" className="bg-purple-50 text-purple-700">
                {courseData?.difficulty}
              </Badge>
            </div>
            <h1 className="mb-4 text-3xl font-bold md:text-4xl">{courseData?.title}</h1>

            <div className="mb-6 flex items-center gap-4">
              <Avatar>
                <AvatarImage
                  src={instructor?.profile_image || "/placeholder.svg"}
                  alt={instructor?.name}
                />
                <AvatarFallback>{instructor?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{instructor?.name}</p>
              </div>
            </div>

            <div className="mb-6 flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-500" />
                <span>{courseData?.course_duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart className="h-5 w-5 text-gray-500" />
                <span>{courseData?.difficulty}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-gray-500" />
                <span>{modules.length} Modules</span>
              </div>
              {/* <div className="flex items-center gap-2">
                <StarRating rating={courseData.rating} />
                <span className="text-sm text-gray-500">({courseData.reviews.length} reviews)</span>
              </div> */}
            </div>

            <div className="mb-8">
              <h2 className="mb-3 text-xl font-semibold">About This Course</h2>
              <p className="text-gray-700">{courseData?.description}</p>
            </div>
          </div>

          <div>
            <Card className="sticky top-24 pt-0">
              <CardHeader className="p-0">
                <img
                  src={courseData?.course_thumbnail || "/placeholder.svg"}
                  alt={courseData?.title}
                  className="h-48 w-full rounded-t-lg object-cover"
                />
              </CardHeader>
              <CardContent className="p-6">
                <div className="mb-4 text-3xl font-bold">{courseData?.course_price} ₹</div>
                <Button className="mb-4 w-full" onClick={handleEnroll}>
                  Enroll Now
                </Button>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <svg
                      className="h-5 w-5 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Full lifetime access
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      className="h-5 w-5 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Access on mobile and TV
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      className="h-5 w-5 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Certificate of completion
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Course Modules */}
        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-bold">Course Content</h2>
          <div className="rounded-lg border">
            <Accordion type="single" collapsible className="w-full">
              {modules.map((module) => (
                <AccordionItem key={module.module_id} value={module.module_id.toString()}>
                  <AccordionTrigger className="px-4 py-4 hover:no-underline">
                    <div className="flex w-full flex-col text-left sm:flex-row sm:items-center sm:justify-between">
                      <div className="font-medium">{module?.module_name}</div>
                      <div className="text-sm text-gray-500">
                        {lessons.filter((lesson) => lesson.module_id === module.module_id).length} lessons
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 pt-0">
                    <ul className="space-y-2">
                      {lessons.map((lesson) => (
                        lesson.module_id === module.module_id ? <li
                          key={lesson.lesson_id}
                          className="flex items-center justify-between rounded-md p-2 hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-2">
                            <svg
                              className="h-5 w-5 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span>{lesson.title}</span>
                          </div>
                        </li> 
                        : null
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        {/* Reviews Section */}
        {/* <div className="mb-12">
          <h2 className="mb-6 text-2xl font-bold">Student Reviews</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courseData.reviews.map((review) => (
              <Card key={review.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={review.user.avatar || "/placeholder.svg"} alt={review.user.name} />
                      <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{review.user.name}</CardTitle>
                      <CardDescription>{review.date}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-2">
                    <StarRating rating={review.rating} />
                  </div>
                  <p className="text-sm text-gray-700">{review.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div> */}

      </main>

      <footer className="border-t bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© 2023 LearnHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default CourseDetailsPage

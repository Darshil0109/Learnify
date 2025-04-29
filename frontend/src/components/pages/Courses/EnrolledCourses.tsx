import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useEffect, useState } from "react"
import api from "@/axios/api"
import { Link } from "react-router-dom"
// Define the course type
interface Course {
    category: string
    course_duration: string 
    course_id: number
    course_price: string
    course_thumbnail: string
    created_at : string
    description: string
    difficulty: string
    enrolled_at: string
    enrollment_id: number
    owner_id: number
    status : string
    title: string
    user_id: number
}
interface CourseProgress {
    course_id: number
    progress: number
    title: string
}

// Sample course data


export default function EnrolledCourses() {
    const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([])
    const [courseProgress, setCourseProgress] = useState<CourseProgress[]>([])
    useEffect(()=>{
        const fetchEnrolledCourses = async () => {
            try {
                const response = await api.get('/api/courses/enrolledCourses');
                const progressResponse = await api.get('/api/courses/course/progress');
                if( progressResponse.status !== 200) {
                    throw new Error('Fetching course progress failed')
                }
                if (response.status !== 200) {
                    throw new Error('Fetching enrolled courses failed')
                }
                setEnrolledCourses(response.data)
                setCourseProgress(progressResponse.data);
            } catch (error) {
                console.error('Error fetching enrolled courses:', error)
            }
        }
        fetchEnrolledCourses()
    },[])
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Enrolled Courses</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrolledCourses.map((course) => (
          <CourseCard key={course.course_id} course={course} progress={courseProgress.find(progress => progress.course_id === course.course_id)?.progress || 0}/>
        ))}
      </div>
    </div>
  )
}

function CourseCard({ course , progress }: { course: Course , progress: number }) {
  return (
    <Card className="h-full flex flex-col pt-0">
      <CardHeader className="p-0">
        <div className="w-full h-48 mb-4 overflow-hidden rounded-t-md bg-gray-100">
          <img src={course.course_thumbnail || "/placeholder.svg"} alt={course.title} className="w-full h-full object-cover" />
        </div>
        <CardTitle className="px-6">{course.title}</CardTitle>
      </CardHeader>
      <CardFooter className="flex flex-col items-start gap-4">
        <div className="w-full space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{progress * 100}%</span>
          </div>
          <Progress value={progress * 100} className="h-2" />
        </div>
        <Link to = {`/course/learning/${course.course_id}`} className="w-full"><Button className="w-full">Continue</Button></Link>
      </CardFooter>
    </Card>
  )
}

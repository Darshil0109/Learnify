import { useEffect, useState } from "react"
import { Sidebar } from "./Sidebar"
import { CourseContent } from "./CourseContent"
import AuthenticatedNavbar from "@/components/custom/AuthenticatedNavbar"
import { useNavigate, useParams } from "react-router-dom"
import api from "@/axios/api"
import { toast } from "sonner"
import axios from "axios"

interface Lesson {
  content: string
  course_id: number
  lesson_id: number
  module_id: number
  title: string
  video_url: string
}

interface Module {
  course_id: number
  module_id: number
  module_name: string
}

// interface Course {
//   course_id: number
//   title: string
//   description: string
//   course_thumbnail: string
//   category: string
//   difficulty: string
//   course_duration:string
//   owner_id: number
//   created_at:string
//   course_price : string
// }

const CourseLearning = () => {
  const navigate = useNavigate();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const courseId = useParams().courseId;
  const [isLoading,setIsLoading] = useState(true);
  // const [courseData, setCourseData] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLessonId, setCurrentLessonId] = useState(lessons[0]?.lesson_id)
  const [completedLessons, setCompletedLessons] = useState<number[]>([])
  const currentLesson = lessons.find((lesson) => lesson.lesson_id === currentLessonId);
  const [courseThumbnail, setCourseThumbnail] = useState<string>("");
  useEffect(()=>{
    const getEnrollmentStatus = async()=>{
      setIsLoading(true);
      try {
        const response = await api.get('/api/courses/course/check-enrollment/'+courseId);
        if (response.status === 200) {
          setIsEnrolled(true);
        }
        
      } catch (error) {
        if(axios.isAxiosError(error) && error.response?.status === 404){
          toast.error('You are not enrolled in this course. Please enroll to access the content.');
          navigate('/courses/course/details/'+courseId);
          setIsEnrolled(false);
        }
      }
    }
    getEnrollmentStatus()
  },[courseId , navigate])
  useEffect(()=>{
    const getCourseData = async()=>{
      setIsLoading(true);
      try {
        const lessonAndModuleResponse = await api.get(`/api/courses/course/lessons/${courseId}`);
        const courseThumbnailResponse = await api.get('/api/courses/course/thumbnail/'+courseId);
        const lessonCompletionResponse = await api.get('/api/courses/course/completed-lessons');
        setCompletedLessons(lessonCompletionResponse.data);
        
        // if (lessonCompletionResponse.status === 200) {
        //   setCompletedLessons(lessonCompletionResponse.data.completed_lessons);
        // }
        setCourseThumbnail(courseThumbnailResponse.data.course_thumbnail);
        
        if ( lessonAndModuleResponse.status !== 200) {
          throw new Error('Fetching course data failed')
        }
        setModules(lessonAndModuleResponse.data.modules);
        setLessons(lessonAndModuleResponse.data.lessons);
        setCurrentLessonId(lessonAndModuleResponse.data.lessons[0]?.lesson_id)
      } catch (error) {
        console.error('Error fetching course data:', error)
      }
      finally{
        setIsLoading(false);
      }
    }
    if(!isEnrolled){
      getCourseData()
    }
  },[isEnrolled,courseId])
  

  // Find current module
  const currentModuleId = currentLesson?.module_id

  const handleLessonClick = (lessonId: number) => {
    setCurrentLessonId(lessonId)
  }
  
  const handleMarkAsCompleted = async() => {
    if (currentLesson && !completedLessons.includes(currentLesson.lesson_id)) {
      const response = await api.post('api/courses/course/complete/lesson/'+currentLesson.lesson_id,{});
      if (response.status !== 201) {
        toast.error('Error marking lesson as completed')
        return
      }
      const newCompletedLessons = [...completedLessons, currentLesson.lesson_id]
      setCompletedLessons(newCompletedLessons)

      const updatedLessons = lessons.sort((a, b) => a.module_id - b.module_id)
      setLessons(updatedLessons)
      // Navigate to next lesson if available
      const currentIndex = updatedLessons.findIndex((lesson) => lesson.lesson_id === currentLessonId)

      if (currentIndex < updatedLessons.length - 1) {
        setCurrentLessonId(updatedLessons[currentIndex + 1].lesson_id)
      }
    }
  }

  return (
    !isLoading && isEnrolled ? (<>
      <AuthenticatedNavbar />
      <div className="mt-16 flex flex-col md:flex-row min-h-screen bg-background">
        <Sidebar
          modules={modules}
          lessons={lessons}
          currentLessonId={currentLessonId}
          currentModuleId={currentModuleId}
          completedLessons={completedLessons}
          onLessonClick={handleLessonClick}
          // certificateDetails={{
          //     studentName: "John Doe",
          //     courseName: "Course Name",
          //     instructorName: "Instructor Name",
          //     date: new Date().toLocaleDateString(),
          //   }}
        />
        {currentLesson && (
          <CourseContent
            lesson={currentLesson}
            isCompleted={completedLessons.includes(currentLesson.lesson_id)}
            onMarkAsCompleted={handleMarkAsCompleted}
            course_thumbnail={courseThumbnail}
          />
        )}
      </div>
    </>):<></>
  )
}

export default CourseLearning
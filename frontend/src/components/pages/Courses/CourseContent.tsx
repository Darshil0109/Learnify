import { Button } from "@/components/ui/button"
import { VideoPlayer } from "./VideoPlayer"

interface Lesson {
  content: string
  course_id: number
  lesson_id: number
  module_id: number
  title: string
  video_url: string
}


interface CourseContentProps {
  lesson: Lesson
  isCompleted: boolean
  onMarkAsCompleted: () => void
  course_thumbnail: string
}

export function CourseContent({ lesson, isCompleted, onMarkAsCompleted , course_thumbnail}: CourseContentProps) {
  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <VideoPlayer videoUrl={lesson.video_url} course_thumbnail={course_thumbnail}/>

        <div className="mt-6">
          <h1 className="text-2xl font-bold">{lesson.title}</h1>
          <p className="text-muted-foreground mt-2">{lesson.content}</p>

          <div className="mt-8">
            <Button onClick={onMarkAsCompleted} disabled={isCompleted} className="w-full md:w-auto">
              {isCompleted ? "Completed" : "Mark as Completed"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

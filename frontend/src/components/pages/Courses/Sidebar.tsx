import { useEffect, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"



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
// interface CertificateProps {
//   studentName: string
//   courseName: string
//   instructorName: string
//   date: string
// }
interface SidebarProps {
  modules: Module[]
  lessons: Lesson[]
  currentLessonId: number
  currentModuleId?: number
  completedLessons: number[]
  onLessonClick: (lessonId: number) => void
  // certificateDetails : CertificateProps
}
export function Sidebar({
  modules,
  lessons,
  currentLessonId,
  currentModuleId,
  completedLessons,
  onLessonClick,
  // certificateDetails,
}: SidebarProps) {
  const [openModules, setOpenModules] = useState<Record<number, boolean>>({})
  const [isCertOpen, setIsCertOpen] = useState(false);
  const allLessonsCompleted = completedLessons.length === lessons.length
  // Initialize with current module open
  useEffect(() => {
    if (currentModuleId) {
      setOpenModules((prev) => ({
        ...prev,
        [currentModuleId]: true,
      }))
    }
  }, [currentModuleId])

  const toggleModule = (moduleId: number) => {
    setOpenModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }))
  }
  // Get lessons for a specific module
  const getLessonsForModule = (moduleId: number) => {
    return lessons.filter((lesson) => lesson.module_id === moduleId)
  }

  // Check if all lessons in a module are completed
  const isModuleCompleted = (moduleId: number) => {
    const moduleLessons = getLessonsForModule(moduleId)
    return moduleLessons.length > 0 && moduleLessons.every((lesson) => completedLessons.includes(lesson.lesson_id))
  }
  
  return (
    <div className="w-full md:w-80 border-r bg-muted/40 h-screen md:h-auto">
      <div className="p-4 font-semibold text-lg border-b">Course Modules</div>
      <ScrollArea className="h-[calc(100vh-57px)]">
        <div className="p-2">
          {modules.map((module) => {
            const isOpen = openModules[module.module_id] || false
            const moduleLessons = getLessonsForModule(module.module_id)
            const moduleCompleted = isModuleCompleted(module.module_id)

            return (
                <Collapsible
                  key={module.module_id}
                  open={isOpen}
                  onOpenChange={() => toggleModule(module.module_id)}
                  className="mb-2"
                >
                  <CollapsibleTrigger className="w-full">
                    <div
                      className={cn(
                        "flex items-center justify-between w-full text-left px-4 py-3 rounded-md",
                        "hover:bg-muted transition-colors",
                        moduleCompleted && "text-muted-foreground",
                      )}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{module.module_name}</span>
                        <span className="text-xs opacity-80">{moduleLessons.length} lessons</span>
                      </div>
                      <div className="flex items-center">
                        {moduleCompleted && <Check className="h-4 w-4 mr-2 flex-shrink-0" />}
                        <ChevronDown
                          className={cn("h-4 w-4 transition-transform duration-200", isOpen && "transform rotate-180")}
                        />
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="pl-4 pr-2 py-1">
                      {moduleLessons.map((lesson) => {
                        const isActive = lesson.lesson_id === currentLessonId
                        const isCompleted = completedLessons.includes(lesson.lesson_id)

                        return (
                          <button
                            key={lesson.lesson_id}
                            onClick={() => onLessonClick(lesson.lesson_id)}
                            className={cn(
                              "w-full text-left px-4 py-2 rounded-md mb-1 flex items-center justify-between transition-colors",
                              isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                              isCompleted && !isActive && "text-muted-foreground",
                            )}
                          >
                            <div className="flex flex-col">
                              <span className="font-medium">{lesson.title}</span>
                            </div>
                            {isCompleted && <Check className="h-4 w-4 flex-shrink-0" />}
                          </button>
                        )
                      })}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
            )
          })}
          <Collapsible
                  open={isCertOpen}
                  onOpenChange={(val) => {
                    if (allLessonsCompleted) setIsCertOpen(val);
                  }}
                  className="mb-2"
                >
                  <CollapsibleTrigger className="w-full">
                    <div
                      className={cn(
                        "flex items-center justify-between w-full text-left px-4 py-3 rounded-md",
                        "hover:bg-muted transition-colors",
                        !allLessonsCompleted ? "opacity-50 cursor-not-allowed" : "",
                      )}
                    >
                        View Certificate
                        <div className="flex items-center">
                        <ChevronDown
                          className={cn("h-4 w-4 transition-transform duration-200", isCertOpen && "transform rotate-180")}
                        />
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="px-4">
                    <div className="pl-4 pr-2 py-1">
                      🎉 Congratulations! You've completed the course. Here's your certificate!
                      <Button className="mt-2 w-full">
                        View Certificate
                      </Button>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
        </div>
      </ScrollArea>
     
    </div>
  )
}
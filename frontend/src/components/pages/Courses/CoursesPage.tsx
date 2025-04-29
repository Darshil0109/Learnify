import { useState, useEffect } from "react"
import { Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import AuthenticatedNavbar from "@/components/custom/AuthenticatedNavbar";
import { Link } from "react-router-dom"
import api from "@/axios/api"
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


// Filter categories
const categories:string[] = ["Web Development", "Data Science", "AI", "Platform Onboarding"]
const levels: string[]  = ["Beginner", "Intermediate", "Advanced"]

const CoursesPage = () => {
    
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedLevels, setSelectedLevels] = useState<string[]>([])
  const [coursesData, setCoursesData] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>(coursesData)
  // Check if mobile view
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  // Filter courses based on search and filters
  useEffect(() => {
    if (coursesData.length > 0) {
        let result = [...coursesData]
        if (searchQuery) {
          result = result.filter(
            (course) =>
              course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              course.description.toLowerCase().includes(searchQuery.toLowerCase()),
          )
        }
        // Filter by categories
        if (selectedCategories.length > 0) {
          result = result.filter((course) => selectedCategories.includes(course.category))
        }
        // Filter by levels
        if (selectedLevels.length > 0) {
          result = result.filter((course) => {
            return selectedLevels.includes(course.difficulty[0].toUpperCase() + course.difficulty.slice(1).toLowerCase())
          })
        }
        setFilteredCourses(result)
    }
    // Filter by search query
  }, [searchQuery, selectedCategories, selectedLevels,coursesData])
  
  // Toggle category selection
  const toggleCategory = (category:string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  // Toggle level selection
  const toggleLevel = (level:string) => {
    
    setSelectedLevels((prev) => (prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]))
  } 
  useEffect(()=>{
    const getCourses = async () =>{
      const response = await api.get('/api/courses');
      setCoursesData(response.data);
      setFilteredCourses(response.data);
    }
    getCourses()
  },[])
  // Filter component used in both desktop and mobile views
  const FilterSection = () => (
    <>  
        <div className="space-y-6">
        <div>
            <h3 className="text-lg font-medium mb-3">Categories</h3>
            <div className="space-y-2">
            {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                <Checkbox
                    id={`category-${category}`}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => toggleCategory(category)}
                />
                <Label htmlFor={`category-${category}`}>{category}</Label>
                </div>
            ))}
            </div>
        </div>

        <div>
            <h3 className="text-lg font-medium mb-3">Level</h3>
            <div className="space-y-2">
            {levels.map((level) => (
                <div key={level} className="flex items-center space-x-2">
                <Checkbox
                    id={`level-${level}`}
                    checked={selectedLevels.includes(level)}
                    onCheckedChange={() => toggleLevel(level)}
                />
                <Label htmlFor={`level-${level}`}>{level}</Label>
                </div>
            ))}
            </div>
        </div>
        </div>
    </>
  ) 
  // Course card component
  const CourseCard = ({ course } : { course : Course}) => (
    <Card className="h-full flex flex-col pt-0">
      <div className="relative aspect-video overflow-hidden rounded-t-lg">
        <img src={course.course_thumbnail || "/placeholder.svg"} alt={course.title} className="object-cover w-full h-full" />
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold">{course.title}</h3>
          <Badge variant="outline">{course.difficulty}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">{course.description}</p>
      </CardContent>
      <CardFooter>
        <Link to={'/courses/course/details/' + course.course_id} ><Button className="w-full cursor-pointer">View Details</Button></Link>
      </CardFooter>
    </Card>
  )

  return (
    <>  
        <AuthenticatedNavbar/>
        <div className="min-h-screen bg-background mt-8">
        

        {/* Main content */}
        <main className="mx-auto p-8 ">
            {/* Search and filter button (mobile) */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                placeholder="Search courses..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {isMobile && (
                <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" className="md:hidden">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                    </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <SheetHeader>
                    <SheetTitle>Filter Courses</SheetTitle>
                    </SheetHeader>
                    <div className="py-4">
                    <FilterSection />
                    </div>
                </SheetContent>
                </Sheet>
            )}
            </div>

            {/* Two-column layout */}
            <div className="flex flex-col md:flex-row gap-8">
            {/* Left column: Filters (desktop only) */}
            <div className="hidden md:block w-full md:w-64 shrink-0">
                <FilterSection />
            </div>

            {/* Right column: Course grid */}
            <div className="flex-grow">
                {filteredCourses.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">No courses found matching your criteria.</p>
                </div>
                ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => (
                    <CourseCard key={course.course_id} course={course} />
                    ))}
                </div>
                )}
            </div>
            </div>
        </main>
        </div>
    </>
  )
}

export default CoursesPage
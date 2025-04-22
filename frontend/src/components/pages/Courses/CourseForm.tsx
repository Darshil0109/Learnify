import React, { useState } from "react"
import { Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import api from "@/axios/api"

interface Lesson {
  id: string
  topic : string
  title: string
  content: string
  video: File | null
}

export default function CourseForm() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [difficulty, setDifficulty] = useState("beginner")
  const [category, setCategory] = useState("")
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([{ id: crypto.randomUUID(), topic:"" , title: "", content: "", video: null }])
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [price, setPrice] = useState(0);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}
    if (title.trim().length < 3) newErrors.title = "Title must be at least 3 characters"
    if (description.trim().length < 10) newErrors.description = "Description must be at least 10 characters"
    if (category.trim().length < 2) newErrors.category = "Category must be at least 2 characters"
    if (price < 0) newErrors.price = "Price must be greater than or equal to 0"
    if (lessons.length === 0) newErrors.lessons = "At least one lesson is required"
    if (!(thumbnail)) newErrors.thumbnail = "Course Thumbnail is required"
    return newErrors
  }

  const handleLessonChange = (id: string, field: keyof Lesson, value: string | File | null) => {
    setLessons(prev =>
      prev.map(lesson => lesson.id === id ? { ...lesson, [field]: value } : lesson)
    )
  }

  const addLesson = () => {
    setLessons(prev => [...prev, { id: crypto.randomUUID(), topic:"", title: "", content: "", video: null }])
  }

  const removeLesson = (id: string) => {
    if (lessons.length > 1) {
      setLessons(prev => prev.filter(lesson => lesson.id !== id))
    }
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validateForm()
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("description", description)
      formData.append("difficulty", difficulty)
      formData.append("category", category)
      formData.append("price", price.toString())
      if (thumbnail) formData.append("thumbnail", thumbnail)

      const lessonsData = lessons.map(({ topic,title, content }) => ({ topic,title, content }))
      formData.append("lessons", JSON.stringify(lessonsData))
      lessons.forEach((lesson, index) => {
        if (lesson.video) {
          formData.append(`lessonVideo_${index}`, lesson.video)
        }
      })
      // formData.append("course_duration", Math.ceil(lessons.length / 3).toString() + " Weeks")
      const response = await api.post('/api/courses/addCourse', formData,{
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      if (response.status === 201) {
        setShowSuccess(true)
        setTitle("")
        setDescription("")
        setDifficulty("beginner")
        setCategory("")
        setThumbnail(null)
        setLessons([{ id: crypto.randomUUID(), title: "", topic:"", content: "", video: null }])
        setTimeout(() => setShowSuccess(false), 5000)
      } else {
        console.error("Submission failed")
      }
    } catch (err) {
      console.error("Error submitting form:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {showSuccess && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>Course and lessons added successfully!</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Add New Course</CardTitle>
            <CardDescription>Fill in the details below to create a new course with lessons.</CardDescription>
          </CardHeader>

          <form onSubmit={onSubmit} >
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Course Details</h3>

                <div className="space-y-2">
                  <Label>Course Title</Label>
                  <Input value={title} onChange={(e : React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} placeholder="Enter course title" />
                  {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={description} onChange={(e : React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)} placeholder="Enter course description" />
                  {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="w-full space-y-2">
                    <Label>Difficulty</Label>
                    <Select value={difficulty} onValueChange={setDifficulty}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent className="w-full">
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-full space-y-2">
                    <Label>Category</Label>
                    <Input value={category} onChange={(e : React.ChangeEvent<HTMLInputElement>) => setCategory(e.target.value)} placeholder="Enter category" />
                    {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
                  </div>
                </div>
                <div className="w-full space-y-2">
                    <Label>Price</Label>
                    <Input value={price} type="number" onChange={(e : React.ChangeEvent<HTMLInputElement>) => setPrice(Number(e.target.value))} placeholder="Enter Course Price" />
                    {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
                  </div>
                <div className="space-y-2">
                  <Label htmlFor="thumbnail">Course Thumbnail</Label>
                  <Input id="thumbnail" name="thumbnail" type="file" accept="image/*" onChange={(e : React.ChangeEvent<HTMLInputElement>) => setThumbnail(e.target.files?.[0] || null)} />
                  {thumbnail && <p className="text-sm text-gray-500 mt-1">Selected: {thumbnail.name}</p>}
                  {errors.thumbnail && <p className="text-red-500 text-sm">{errors.thumbnail}</p>}
                </div>
              </div>

              <Separator />

              {/* Lessons */}
              <div className="space-y-4 mb-4">
                {errors.lessons && <p className="text-red-500 text-sm">{errors.lessons}</p>}
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Lessons</h3>
                  <Button type="button" onClick={addLesson} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Lesson
                  </Button>
                </div>

                {lessons.map((lesson, index) => (
                  <Card key={lesson.id} className="border border-gray-200">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Lesson {index + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeLesson(lesson.id)}
                          disabled={lessons.length === 1}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-3">
                      <div className="space-y-2">
                        <Label>Topic</Label>
                        <Input required value={lesson.topic} onChange={(e : React.ChangeEvent<HTMLInputElement>) => handleLessonChange(lesson.id, "topic", e.target.value)} />
                      </div>

                      <div className="space-y-2">
                        <Label>Lesson Title</Label>
                        <Input required value={lesson.title} onChange={(e : React.ChangeEvent<HTMLInputElement>) => handleLessonChange(lesson.id, "title", e.target.value)} />
                      </div>

                      <div className="space-y-2">
                        <Label>Lesson Content</Label>
                        <Textarea required value={lesson.content} onChange={(e : React.ChangeEvent<HTMLTextAreaElement>) => handleLessonChange(lesson.id, "content", e.target.value)} />
                      </div>

                      <div className="space-y-2">
                        <Label>Lesson Video</Label>
                        <Input required type="file" name="course_videos" accept="video/*" onChange={(e : React.ChangeEvent<HTMLInputElement>) => handleLessonChange(lesson.id, "video", e.target.files?.[0] || null)} />
                        {lesson.video && <p className="text-sm text-gray-500 mt-1">Selected: {lesson.video.name}</p>}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>

            <CardFooter className="flex justify-end space-x-4 border-t p-6">
              <Button type="button" variant="outline" onClick={() => window.location.reload()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Add Course"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, X } from "lucide-react";
import AuthenticatedNavbar from "@/components/custom/AuthenticatedNavbar";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import api from "@/axios/api";
import { profile } from "console";
const courses = [
  {
    id: 1,
    title: "React for Beginners",
    description: "Learn the basics of React.js",
    progress: 80,
  },
  {
    id: 2,
    title: "Advanced Tailwind CSS",
    description: "Master utility-first design",
    progress: 45,
  },
  {
    id: 3,
    title: "JavaScript Essentials",
    description: "Core concepts and DOM manipulation",
    progress: 100,
  },
  {
    id: 4,
    title: "Node.js Fundamentals",
    description: "Backend with Express and MongoDB",
    progress: 30,
  },
];



const quizzes = [
  { title: "React Basics", score: 85, total: 100 },
  { title: "JS Fundamentals", score: 70, total: 100 },
  { title: "CSS Flexbox", score: 90, total: 100 },
];

export default function ProfilePage() {
  
  interface User {
    name: string;
    email: string;
    profile_image: string;
    role: string;
    is_verified: boolean;
    created_at: string;
  }
  interface Skill {
    skill_id : number;
    skill_name : string;
  }
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [defaultSkills,setDefaultSkills] = useState<number[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<number[]>([...defaultSkills]);
  const [searchQuery, setSearchQuery] = useState("");
  const [userData , setUserData] = useState<User | null>(null);
  const [skills , setSkills] = useState<Skill[]>([]);
  const [open, setOpen] = useState(false);
  const [isUpdating,setIsUpdating] = useState(false);
  useEffect(()=>{
    const getUserData = async () => {
      try {
        const response = await api.get(`/api/users`);
        setUserData(response.data);

        const skillResponse = await api.get('/api/skills');
        setSkills(skillResponse.data);
        
        const defaultSkillResponse = await api.get('/api/users/skills');
        setDefaultSkills(defaultSkillResponse.data);
      } catch (error) {
        console.log(error);
      }
    }
    getUserData();
  },[]);
  useEffect(()=>{
    setSelectedSkills([...defaultSkills]);
  },[defaultSkills])
  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);
    const formData1 = new FormData(e.currentTarget);
    const name = formData1.get('name') as string;
    const image = formData1.get('profile_image') as File;
    const formData = new FormData();
    formData.append('name', name);
    formData.append("profile_image", image);
    formData.append("skills", JSON.stringify(selectedSkills));

    try {
      const response = await api.post('/api/users/editProfile',formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },   
        });
      console.log(response);
      
      if (response.data.message === "Profile updated successfully") {
        alert("Profile updated successfully");
      }
    } catch (error) {
      console.log(error);
    }finally{
      setImagePreview(null);
      setOpen(false);
      setIsUpdating(false);
    }
  }
  
  return (
    <>
      <AuthenticatedNavbar />
      <div className="flex flex-col lg:flex-row bg-background min-h-screen mt-16">
        {/* Sidebar */}
        <aside className="w-full lg:w-1/4 bg-muted p-6 shadow-md ">
          <div className="flex flex-col items-center text-center space-y-4">
            <Avatar className="w-16 h-16 sm:w-20 sm:h-20">
              <AvatarImage src={userData?.profile_image || `https://api.dicebear.com/7.x/initials/svg?seed=${userData?.name[0]}`} />
              <AvatarFallback>{userData?.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold">{userData?.name}</h2>
              <p className="text-sm text-muted-foreground">{userData?.email}</p>
            </div>

            <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogTrigger asChild>
                <Button onClick={() => setOpen(true)} className="gap-2 mt-2 bg-white cursor-pointer" variant="secondary" size="sm">
                  <Pencil className="w-4 h-4" />
                  Edit Profile
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
                <AlertDialogHeader>
                  <AlertDialogTitle>Edit Profile</AlertDialogTitle>
                  <AlertDialogDescription />
                </AlertDialogHeader>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" defaultValue={userData?.name} required placeholder="Enter your name" />
                  </div>

                  <div className="space-y-2">
                    <Label>Profile Image</Label>
                    <input
                      type="file"
                      accept="image/*"
                      name="profile_image"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => setImagePreview(reader.result as string);
                          reader.readAsDataURL(file);
                        }
                      }}
                      required
                    />
                    <div className="mt-2 relative w-20">
                      <img
                        src={imagePreview || userData?.profile_image }
                        alt="Preview"
                        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover ${imagePreview ? '' : 'hidden'}`}
                      />
                      <Button type="button" variant={"outline"} onClick={() => setImagePreview(null)} className={`${imagePreview ? '':'hidden'} absolute -top-1 cursor-pointer right-0 rounded-full h-2 w-2 `}>x</Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="skills">Search Skills</Label>
                      <Input
                        className="mt-2"
                        id="skills"
                        placeholder="Type to search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    {/* Search Results */}
                    {searchQuery && (
                      <div>
                        <h4 className="text-sm font-medium mb-1">Search Results</h4>
                        <div className="flex flex-wrap gap-2">
                          {skills
                            .filter((skill) =>
                              skill.skill_name.toLowerCase().includes(searchQuery.toLowerCase())
                            )
                            .map((skill, index) => {
                              const isSelected = selectedSkills.includes(skill.skill_id);
                              return (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className={`cursor-pointer ${
                                    isSelected ? "ring-2 ring-blue-500" : ""
                                  }`}
                                  onClick={() => {
                                    if (isSelected) {
                                      setSelectedSkills(
                                        selectedSkills.filter((s) => s !== skill.skill_id)
                                      );
                                    } else {
                                      setSelectedSkills([...selectedSkills, skill.skill_id]);
                                    }
                                  }}
                                >
                                  {skill.skill_name}

                                </Badge>
                              );
                            })}
                        </div>
                      </div>
                    )}
                    {/* Selected Skills */}
                    <div>
                      <h4 className="text-sm font-medium mb-1">Selected Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedSkills.length > 0 ? (
                          selectedSkills.map((id, idx) => {
                            const skill = skills.find((s) => s.skill_id === id);
                            return (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="cursor-pointer flex items-center gap-1 pr-2 ring-2 ring-blue-500"
                                onClick={() =>
                                  setSelectedSkills(selectedSkills.filter((_, i) => i !== idx))
                                }
                              >
                                {skill?.skill_name} 
                                <X className="h-3 w-3 opacity-60 hover:opacity-100" />
                              </Badge>
                            );
                          })
                        ) : (
                          <p className="text-muted-foreground text-sm italic">No skills selected.</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <AlertDialogFooter className="mt-4">
                    <AlertDialogCancel onClick={() =>{ setSelectedSkills([...defaultSkills]); setImagePreview(null)}}>
                      Cancel
                    </AlertDialogCancel>
                    <Button disabled={isUpdating} type="submit">{isUpdating ? 'Saving..' : 'Save'}</Button>
                  </AlertDialogFooter>
                </form>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <div className="mt-8 w-full">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {defaultSkills.map((id, index) => {
                const skill = skills.find((s) => s.skill_id === id);
                return (
                  <Badge variant={"outline"} key={index} className="text-sm font-semibold">
                    {skill?.skill_name}
                  </Badge>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="w-full lg:w-3/4 p-4 sm:p-6 space-y-8 overflow-y-auto">
          {/* Courses */}
          <section>
            <h1 className="text-xl sm:text-2xl font-bold mb-4">Your Courses</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {courses.map((course) => (
                <Card key={course.id}>
                  <CardHeader>
                    <CardTitle>{course.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{course.description}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-2">Progress: {course.progress}%</p>
                    <Progress value={course.progress} />
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Quizzes */}
          <section>
            <h2 className="text-xl font-bold mb-4">Quiz Results</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quizzes.map((quiz, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{quiz.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Score: {quiz.score}/{quiz.total}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <Progress value={(quiz.score / quiz.total) * 100} />
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

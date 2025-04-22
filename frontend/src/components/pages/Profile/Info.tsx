import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, X } from "lucide-react";
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
const Info = () => {
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
      const [imageFormopen, setImageFormOpen] = useState(false);
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
      },[defaultSkills]);
      const handleImageChange = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsUpdating(true);
        const formData1 = new FormData(e.currentTarget);
        const image = formData1.get('profile_image') as File;
        const formData = new FormData();
        formData.append("profile_image", image);
        
        try {
          const response = await api.post('/api/users/editProfileImage',formData,
          {
              headers: {
                'Content-Type': 'multipart/form-data',
              },   
          });
          if (response.data.message === "Profile Image updated successfully") {
            if (userData) {
              setUserData({
                ...userData,
                profile_image: response.data.profile_image as string,
              });
            }
            alert("Profile Image updated successfully");
          }
        } catch (error) {
          console.log(error);
        }finally{
          setImagePreview(null);
          setImageFormOpen(false);
          setIsUpdating(false);
        }
      }
      const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsUpdating(true);
        const formData1 = new FormData(e.currentTarget);
        const name = formData1.get('name') as string;
        
        const formData = new FormData();
        formData.append('name', name);
        formData.append("skills", JSON.stringify(selectedSkills));
    
        try {
          const response = await api.post('/api/users/editProfile',formData);
          if (response.data.message === "Profile updated successfully") {
            alert("Profile updated successfully");
          }
          setSelectedSkills(skills.filter(skill => selectedSkills.includes(skill.skill_id) ? skill.skill_id : null).map(skill => skill.skill_id));
          setDefaultSkills(selectedSkills);
          if (userData) {
            setUserData({
              ...userData,
              name: name,
            });
          }
        } catch (error) {
          console.log(error);
        }finally{
          setOpen(false);
          setSearchQuery("");
          setIsUpdating(false);
        }
      }
  return (
    <>
    {/* Main Content */}
    <div className="space-y-6">
            {/* Profile Header */}
            <div className="card p-6">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="relative">
                  <img
                    src={userData?.profile_image || `https://api.dicebear.com/7.x/initials/svg?seed=${userData?.name[0]}`}
                    alt="User"
                    className="h-24 w-24 rounded-full object-cover sm:block justify-self-center"
                  />
                  <AlertDialog open={imageFormopen} onOpenChange={setImageFormOpen}>
                    <AlertDialogTrigger asChild>
                      <button onClick={()=>{setImageFormOpen(true)}} className="absolute cursor-pointer bottom-0 left-[calc(50%+1.5rem)] sm:right-0 rounded-full bg-primary p-1 text-primary-foreground">
                        <Pencil className="w-4 h-4" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <form onSubmit={handleImageChange} encType="multipart/form-data">
                       <AlertDialogHeader>
                         <AlertDialogTitle>Update Profile Image</AlertDialogTitle>
                          <AlertDialogDescription></AlertDialogDescription>
                          <div className="space-y-2 my-2">
                            <Label htmlFor="profileimage">Profile Image</Label>
                            <div className="mt-2 relative w-20">
                              <img
                                src={imagePreview || userData?.profile_image }
                                alt="Preview"
                                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover`}
                              />
                              <Button type="button" variant={"outline"} onClick={() => setImagePreview(null)} className={`${imagePreview ? '':'hidden'} absolute -top-1 cursor-pointer right-0 rounded-full h-2 w-2 `}>x</Button>
                            </div>
                            <Input
                              id="profileimage"
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
                              className="border w-full px-2 py-1"
                            />
                          </div>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <Button disabled={isUpdating} type="submit">{isUpdating ? 'Saving..' : 'Save'}</Button>
                          </AlertDialogFooter>
                        </form>
                  </AlertDialogContent>
                  </AlertDialog>
                  
                </div>
                <div className="flex-1 space-y-2">
                  <h2 className="text-2xl font-bold">{userData?.name}</h2>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-muted px-2 py-1 text-xs">
                      {userData?.role === "student" ? "Student" : "Instructor"}
                    </span>
                  </div>
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
            </div>

            {/* Skills */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Skills</h3>
              </div>
                <div className="flex flex-wrap gap-2">
                {defaultSkills.map((id, index) => {
                  const skill = skills.find((s) => s.skill_id === id);
                  return (
                  <div key={index} className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm">
                    {skill?.skill_name}
                  </div>
                  );
                })}
                </div>
            </div>

            

            {/* Achievements */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4">Achievements</h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {[
                  {
                    title: "Fast Learner",
                    description: "Completed 5 courses in one month",
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-8 w-8 text-yellow-500"
                      >
                        <circle cx="12" cy="8" r="6" />
                        <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
                      </svg>
                    ),
                  },
                  {
                    title: "Consistent",
                    description: "Logged in for 30 consecutive days",
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-8 w-8 text-blue-500"
                      >
                        <rect width="18" height="18" x="3" y="3" rx="2" />
                        <path d="M9 13h6" />
                        <path d="M12 10v6" />
                      </svg>
                    ),
                  },
                  {
                    title: "Helper",
                    description: "Answered 25 questions in the forum",
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-8 w-8 text-green-500"
                      >
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                    ),
                  },
                  {
                    title: "Early Bird",
                    description: "Joined during the platform's first year",
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-8 w-8 text-purple-500"
                      >
                        <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
                        <line x1="16" x2="2" y1="8" y2="22" />
                        <line x1="17.5" x2="9" y1="15" y2="15" />
                      </svg>
                    ),
                  },
                ].map((achievement, index) => (
                  <div key={index} className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/50">
                    {achievement.icon}
                    <h4 className="font-medium mt-2">{achievement.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
    </>
  )
}

export default Info
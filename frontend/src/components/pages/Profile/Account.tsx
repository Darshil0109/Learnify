import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Pencil } from "lucide-react";
import { useState } from "react";
import api from "@/axios/api";
import { useNavigate } from "react-router-dom";
const Account = () => {
  const [deleteFormOpen, setDeleteFormOpen] = useState(false);
  const [isUpdating,setIsUpdating] = useState(false);
  const navigate = useNavigate();
  const handleDeleteFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const response = await api.delete('/api/users/deleteAccount',{});
      if (response.status === 200) {
        setDeleteFormOpen(false);
        navigate('/signup')
      } 
    } catch (error) {
      console.log('error');
    }
    finally {
      setIsUpdating(false);
    }
  }
  return (
    <div>
      <AlertDialog open={deleteFormOpen} onOpenChange={setDeleteFormOpen}>
        <p className="my-4 text-2xl font-semibold">Delete your Account ? </p>
        <AlertDialogTrigger asChild>
          <Button onClick={()=>{setDeleteFormOpen(true)}} className="cursor-pointer">
            <Pencil className="w-4 h-4" /> Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <form onSubmit={handleDeleteFormSubmit}>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Your account ?</AlertDialogTitle>
              <AlertDialogDescription>Deleting your account will permanentely delete your account and will remove all your data.
              This action cannot be undone. Please proceed with caution.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button disabled={isUpdating} type="submit">{isUpdating ? 'Deleting..' : 'Delete'}</Button>
              </AlertDialogFooter>
            </form>
      </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default Account
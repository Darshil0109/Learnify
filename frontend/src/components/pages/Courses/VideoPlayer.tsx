interface VideoPlayerProps {
  videoUrl: string
  course_thumbnail : string
}

export function VideoPlayer({ videoUrl,course_thumbnail }: VideoPlayerProps) {
  
  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
      <video src={videoUrl} controlsList="nodownload" controls className="w-full h-full" poster={course_thumbnail}>
        Your browser does not support the video tag.
      </video>
    </div>
  )
}
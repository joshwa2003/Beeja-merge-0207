import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import RenderSteps from "../../../../components/core/Dashboard/AddCourse/RenderSteps"
import { resetCourseState } from "../../../../slices/courseSlice"

export default function CreateCourse({ onCancel }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
    // Reset course state when admin starts creating a new course
    dispatch(resetCourseState())
  }, [dispatch])


  return (
    <div className="w-full">
      {/* Mobile Tips Section - Collapsible */}
      <div className="lg:hidden mb-6">
        <details className="rounded-md border border-richblack-700 bg-richblack-800">
          <summary className="cursor-pointer p-4 text-base font-medium text-richblack-5 hover:bg-richblack-700 transition-colors">
            ⚡ Course Upload Tips
          </summary>
          <div className="p-4 pt-0">
            <ul className="ml-4 list-disc space-y-3 text-sm text-richblack-300">
              <li>Set the Course Price option or make it free.</li>
              <li>Standard size for the course thumbnail is 1024x576.</li>
              <li>Video section controls the course overview video.</li>
              <li>Course Builder is where you create & organize a course.</li>
              <li>Add Topics in the Course Builder section to create lessons, quizzes, and assignments.</li>
              <li>Information from the Additional Data section shows up on the course single page.</li>
              <li>Make Announcements to notify any important notes to all enrolled students at once.</li>
            </ul>
          </div>
        </details>
      </div>

      <div className="flex w-full items-start gap-x-6">
        <div className="flex flex-1 flex-col">
          <h1 className="mb-8 lg:mb-14 text-2xl lg:text-3xl font-medium text-richblack-5">
            Create New Course
          </h1>
          <div className="flex-1">
            <RenderSteps />
          </div>
        </div>

        {/* Desktop Course Upload Tips */}
        <div className="sticky top-10 hidden lg:block max-w-[400px] flex-1 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
          <p className="mb-8 text-lg text-richblack-5">⚡ Course Upload Tips</p>
          <ul className="ml-5 list-item list-disc space-y-4 text-xs text-richblack-5">
            <li>Set the Course Price option or make it free.</li>
            <li>Standard size for the course thumbnail is 1024x576.</li>
            <li>Video section controls the course overview video.</li>
            <li>Course Builder is where you create & organize a course.</li>
            <li>Add Topics in the Course Builder section to create lessons, quizzes, and assignments.</li>
            <li>Information from the Additional Data section shows up on the course single page.</li>
            <li>Make Announcements to notify any important</li>
            <li>Notes to all enrolled students at once.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

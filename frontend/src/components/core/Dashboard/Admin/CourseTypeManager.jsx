import { useEffect, useState, useCallback, useMemo, memo } from 'react'
import { useSelector } from 'react-redux'
import { FiBook, FiUser, FiDollarSign, FiTag, FiSettings, FiSearch, FiFilter, FiCalendar, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { getAllCourses, setCourseType } from '../../../../services/operations/adminAPI'
import { formatDate, getRelativeTime } from '../../../../utils/dateFormatter'
import toast from 'react-hot-toast'

// Custom debounce function
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

const ITEMS_PER_PAGE = 10;

// Memoized course row component
const CourseRow = memo(({ course, onTypeChange, processing }) => (
  <tr className="border-b border-richblack-600 hover:bg-richblack-700/30">
    <td className="p-3">
      <div className="flex items-center gap-3">
        <img
          src={course.thumbnail}
          alt={course.courseName}
          className="w-12 h-8 rounded object-cover"
        />
        <span className="font-medium">{course.courseName}</span>
      </div>
    </td>
    <td className="p-3">
      {course.instructor ? (
        `${course.instructor.firstName} ${course.instructor.lastName}`
      ) : (
        <span className="text-red-400">No instructor</span>
      )}
    </td>
    <td className="p-3">₹{course.originalPrice}</td>
    <td className="p-3">
      <span className={course.courseType === 'Free' ? 'text-green-400' : 'text-yellow-400'}>
        {course.courseType === 'Free' ? 'Free' : `₹${course.price}`}
      </span>
    </td>
    <td className="p-3">
      <span className={`px-2 py-1 rounded text-xs ${
        course.courseType === 'Free' 
          ? 'bg-green-500/20 text-green-400' 
          : 'bg-yellow-500/20 text-yellow-400'
      }`}>
        {course.courseType}
      </span>
    </td>
    <td className="p-3">
      <div className="flex items-center gap-2">
        {course.courseType === 'Paid' ? (
          <button
            onClick={() => onTypeChange(course._id, 'Free')}
            disabled={processing === course._id}
            className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-400 hover:bg-green-500/20 rounded-lg transition-colors disabled:opacity-50"
            title="Make Free"
          >
            {processing === course._id ? (
              <div className="w-4 h-4 animate-spin rounded-full border-b-2 border-green-400"/>
            ) : (
              <>
                <FiTag size={16} />
                <span className="text-xs font-medium">Make Free</span>
              </>
            )}
          </button>
        ) : (
          <button
            onClick={() => onTypeChange(course._id, 'Paid')}
            disabled={processing === course._id}
            className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 rounded-lg transition-colors disabled:opacity-50"
            title="Make Paid"
          >
            {processing === course._id ? (
              <div className="w-4 h-4 animate-spin rounded-full border-b-2 border-yellow-400"/>
            ) : (
              <>
                <FiDollarSign size={16} />
                <span className="text-xs font-medium">Make Paid</span>
              </>
            )}
          </button>
        )}
      </div>
    </td>
  </tr>
));

CourseRow.displayName = 'CourseRow';

export default function CourseTypeManager() {
  const { token } = useSelector((state) => state.auth)
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)
  const [processingId, setProcessingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)

  // Memoized filtered courses
  const filteredCourses = useMemo(() => {
    let filtered = courses;
    
    if (typeFilter !== 'All') {
      filtered = filtered.filter(course => course.courseType === typeFilter);
    }
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(course => 
        course.courseName.toLowerCase().includes(searchLower) ||
        course.instructor?.firstName?.toLowerCase().includes(searchLower) ||
        course.instructor?.lastName?.toLowerCase().includes(searchLower)
      );
    }
    
    return filtered;
  }, [courses, typeFilter, searchTerm]);

  // Memoized paginated courses
  const paginatedCourses = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCourses.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredCourses, currentPage]);

  // Memoized stats
  const stats = useMemo(() => ({
    total: courses.length,
    free: courses.filter(c => c.courseType === 'Free').length,
    paid: courses.filter(c => c.courseType === 'Paid').length,
    noInstructor: courses.filter(c => !c.instructor).length
  }), [courses]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);

  useEffect(() => {
    fetchCourses()
  }, [])

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [typeFilter, searchTerm]);

  const fetchCourses = async () => {
    setLoading(true)
    try {
      const result = await getAllCourses(token)
      if (result?.courses) {
        setCourses(result.courses)
      }
    } catch (error) {
      toast.error('Failed to fetch courses')
    }
    setLoading(false)
  }

  const handleCourseTypeChange = async (courseId, courseType) => {
    setProcessingId(courseId)
    try {
      const result = await setCourseType(courseId, courseType, token)
      if (result) {
        toast.success(`Course type changed to ${courseType}`)
        setCourses(courses.map(course => 
          course._id === courseId 
            ? {
                ...course,
                ...result,
                courseType: result.courseType,
                price: result.price,
                originalPrice: result.originalPrice,
                adminSetFree: result.adminSetFree
              }
            : course
        ))
      }
    } catch (error) {
      toast.error(`Failed to change course type`)
    }
    setProcessingId(null)
  }

  // Debounced search handler
  const debouncedSetSearchTerm = useCallback(
    debounce((value) => setSearchTerm(value), 300),
    []
  );

  return (
    <div className="animate-fade-in-up space-y-6">
      {/* Header Section */}
      <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700/50">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Course Type Management
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Manage course pricing and availability settings
            </p>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            <div className="bg-slate-700/30 rounded p-2 text-center">
              <p className="text-lg font-semibold text-white">{stats.total}</p>
              <p className="text-xs text-slate-400">Total</p>
            </div>
            <div className="bg-green-500/10 rounded p-2 text-center border border-green-500/20">
              <p className="text-lg font-semibold text-green-400">{stats.free}</p>
              <p className="text-xs text-green-400">Free</p>
            </div>
            <div className="bg-yellow-500/10 rounded p-2 text-center border border-yellow-500/20">
              <p className="text-lg font-semibold text-yellow-400">{stats.paid}</p>
              <p className="text-xs text-yellow-400">Paid</p>
            </div>
            <div className="bg-red-500/10 rounded p-2 text-center border border-red-500/20">
              <p className="text-lg font-semibold text-red-400">{stats.noInstructor}</p>
              <p className="text-xs text-red-400">No Instructor</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700/50">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search courses or instructors..."
              onChange={(e) => debouncedSetSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500/50 transition-colors"
            />
          </div>
          
          {/* Type Filter */}
          <div className="flex items-center gap-3">
            <FiFilter className="text-slate-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-500/50 transition-colors"
            >
              <option value="All">All Types</option>
              <option value="Free">Free Courses</option>
              <option value="Paid">Paid Courses</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700/50 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-blue-500 rounded-full animate-spin" style={{ animationDelay: '0.15s' }}></div>
            </div>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6">
            <div className="w-20 h-20 bg-slate-700/50 rounded-full flex items-center justify-center mb-4">
              <FiBook className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {courses.length === 0 ? 'No courses found' : 'No matching courses'}
            </h3>
            <p className="text-slate-400 text-center max-w-md">
              {courses.length === 0 
                ? "No courses are available in the system yet."
                : "No courses match your current filters. Try adjusting your search or filter criteria."
              }
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-white text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-richblack-700">
                    <th className="p-3 border border-richblack-600">Course</th>
                    <th className="p-3 border border-richblack-600">Instructor</th>
                    <th className="p-3 border border-richblack-600">Original Price</th>
                    <th className="p-3 border border-richblack-600">Current Price</th>
                    <th className="p-3 border border-richblack-600">Type</th>
                    <th className="p-3 border border-richblack-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCourses.map((course) => (
                    <CourseRow
                      key={course._id}
                      course={course}
                      onTypeChange={handleCourseTypeChange}
                      processing={processingId}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="lg:hidden p-4 space-y-4">
              {paginatedCourses.map((course) => (
                <div key={course._id} className="bg-slate-700/30 rounded-xl p-4 space-y-3">
                  {/* Course Header */}
                  <div className="flex items-start gap-3">
                    <img
                      src={course.thumbnail}
                      alt={course.courseName}
                      className="w-16 h-12 sm:w-20 sm:h-14 rounded object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white text-sm sm:text-base truncate">
                        {course.courseName}
                      </h3>
                      <p className="text-slate-400 text-xs sm:text-sm">
                        {course.instructor ? (
                          `${course.instructor.firstName} ${course.instructor.lastName}`
                        ) : (
                          <span className="text-red-400">No instructor</span>
                        )}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      course.courseType === 'Free' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {course.courseType}
                    </span>
                  </div>

                  {/* Course Details */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Original Price:</span>
                      <p className="text-white font-medium">₹{course.originalPrice}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Current Price:</span>
                      <p className={`font-medium ${
                        course.courseType === 'Free' 
                          ? 'text-green-400' 
                          : 'text-yellow-400'
                      }`}>
                        {course.courseType === 'Free' ? 'Free' : `₹${course.price}`}
                      </p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex justify-end pt-2 border-t border-slate-600/50">
                    {course.courseType === 'Paid' ? (
                      <button
                        onClick={() => handleCourseTypeChange(course._id, 'Free')}
                        disabled={processingId === course._id}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-400 hover:bg-green-500/20 rounded-lg transition-colors disabled:opacity-50 text-sm"
                      >
                        {processingId === course._id ? (
                          <div className="w-4 h-4 animate-spin rounded-full border-b-2 border-green-400"/>
                        ) : (
                          <>
                            <FiTag size={14} />
                            <span>Make Free</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleCourseTypeChange(course._id, 'Paid')}
                        disabled={processingId === course._id}
                        className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 rounded-lg transition-colors disabled:opacity-50 text-sm"
                      >
                        {processingId === course._id ? (
                          <div className="w-4 h-4 animate-spin rounded-full border-b-2 border-yellow-400"/>
                        ) : (
                          <>
                            <FiDollarSign size={14} />
                            <span>Make Paid</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 p-4 border-t border-slate-700">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-slate-700/30 text-slate-400 hover:bg-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiChevronLeft />
                </button>
                <span className="text-sm text-slate-400">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-slate-700/30 text-slate-400 hover:bg-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiChevronRight />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

using AutoMapper;
using CrochetHub.DTOs.Course;
using CrochetHub.Models;

namespace CrochetHub.Mappers
{
    public class CourseMapper : Profile
    {
        public CourseMapper()
        {
            // Course -> CourseDto
            CreateMap<Course, CourseDto>()
                .ForMember(dest => dest.Difficulty,
                    opt => opt.MapFrom(src => src.Difficulty != null ? src.Difficulty.Value : null))
                .ForMember(dest => dest.InstructorName,
                    opt => opt.MapFrom(src =>
                        src.Instructor != null && src.Instructor.User != null && src.Instructor.User.Person != null
                            ? src.Instructor.User.Person.FirstName + " " + src.Instructor.User.Person.LastName
                            : string.Empty))
                .ForMember(dest => dest.Tags,
                    opt => opt.MapFrom(src =>
                        src.CourseTags.Select(ct => ct.Tag != null ? ct.Tag.Name : string.Empty).ToList()))
                .ForMember(dest => dest.Prerequisites,
                    opt => opt.MapFrom(src =>
                        src.Prerequisites.Select(cp => new PrerequisiteDto
                        {
                            CourseID = cp.PrerequisiteID,
                            Title = cp.Prerequisite != null ? cp.Prerequisite.Title : string.Empty
                        }).ToList()))
                .ForMember(dest => dest.TotalLessons,
                    opt => opt.MapFrom(src => src.Lessons.Count))
                .ForMember(dest => dest.AverageRating,
                    opt => opt.MapFrom(src =>
                        src.Reviews.Any() ? src.Reviews.Average(r => r.Rating) : 0))
                .ForMember(dest => dest.TotalEnrollments,
                    opt => opt.MapFrom(src => src.Enrollments.Count));

            // CreateCourseDto -> Course
            CreateMap<CreateCourseDto, Course>()
                .ForMember(dest => dest.CourseID, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.InstructorID, opt => opt.Ignore())
                .ForMember(dest => dest.CourseTags, opt => opt.Ignore())
                .ForMember(dest => dest.Prerequisites, opt => opt.Ignore())
                .ForMember(dest => dest.Lessons, opt => opt.Ignore())
                .ForMember(dest => dest.Enrollments, opt => opt.Ignore())
                .ForMember(dest => dest.Reviews, opt => opt.Ignore())
                .ForMember(dest => dest.Patterns, opt => opt.Ignore())
                .ForMember(dest => dest.Difficulty, opt => opt.Ignore())
                .ForMember(dest => dest.Instructor, opt => opt.Ignore());
        }
    }
}

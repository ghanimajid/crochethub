using System.ComponentModel.DataAnnotations.Schema;

namespace CrochetHub.Models
{
    public class CoursePrerequisite
    {
        public int CourseID { get; set; }
        public int PrerequisiteID { get; set; }

        [ForeignKey("CourseID")]
        public Course? Course { get; set; }

        [ForeignKey("PrerequisiteID")]
        public Course? Prerequisite { get; set; }
    }
}

using System.ComponentModel.DataAnnotations.Schema;

namespace CrochetHub.Models
{
    public class CourseTag
    {
        public int CourseID { get; set; }
        public int TagID { get; set; }

        [ForeignKey("CourseID")]
        public Course? Course { get; set; }

        [ForeignKey("TagID")]
        public Tag? Tag { get; set; }
    }
}

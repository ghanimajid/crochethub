using System.ComponentModel.DataAnnotations.Schema;

namespace CrochetHub.Models
{
    public class PatternTag
    {
        public int PatternID { get; set; }
        public int TagID { get; set; }

        [ForeignKey("PatternID")]
        public Pattern? Pattern { get; set; }

        [ForeignKey("TagID")]
        public Tag? Tag { get; set; }
    }
}

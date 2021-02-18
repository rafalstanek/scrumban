using System;

namespace Scrumban.Model {

    public class ProjectUser {

        public Guid ProjectId { get; set; }

        public Guid UserId { get; set; }

        public virtual Project Project { get; set; }

        public virtual User User { get; set; }

    }

}

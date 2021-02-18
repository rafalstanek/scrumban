using System;

namespace Scrumban.Model {

    public class Task {

        public Guid Id { get; set; }

        public string Status { get; set; }

        public string Name { get; set; }

        public Guid ProjectId { get; set; }

        public Guid? UserId { get; set; }

        public virtual Project Project { get; set; }

        public virtual User User { get; set; }

    }

}

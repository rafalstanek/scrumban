using System;
using System.Collections.Generic;

namespace Scrumban.Model {

    public class Project
    {

        public Guid Id { get; set; }

        public string Name { get; set; }

        public bool Finished { get; set; }

        public Guid OwnerId { get; set; }

        public virtual User Owner { get; set; }

        public List<ProjectUser> ProjectUsers { get; set; }

        public List<Task> Tasks { get; set; }

        public List<Message> Messages { get; set; }
    }
}

using System;
using System.Collections.Generic;

namespace Scrumban.Model {

    public class User {

        public Guid Id { get; set; }

        public string Username { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Role { get; set; }

        public byte[] PasswordHash { get; set; }

        public byte[] PasswordSalt { get; set; }

        public List<Project> OwnedProjects { get; set; }

        public List<ProjectUser> ProjectsUsers { get; set; }

        public List<Task> Tasks { get; set; }

        public List<Message> Messages { get; set; }

        public virtual PushSubscription PushSubscription { get; set; }

        public string FullName => $"{FirstName} {LastName}";

    }

}

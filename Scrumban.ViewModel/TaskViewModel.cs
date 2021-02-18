using System;
using Scrumban.Model;

namespace Scrumban.ViewModel {
    public class TaskViewModel {

        public Guid Id { get; set; }

        public string Status { get; set; }

        public string Name { get; set; }

        public ProjectViewModel Project { get; set; }

        public Guid UserId { get; set; }

        public UserViewModel User { get; set; }

        public TaskViewModel() {

        }

        public TaskViewModel(Task t) {
            Id = t.Id;
            Status = t.Status;
            Name = t.Name;
            Project = new ProjectViewModel {
                Id = t.Project.Id,
                Name = t.Project.Name
            };
            if (t.User != null) {
                User = new UserViewModel {
                    Id = t.User.Id,
                    FullName = t.User.FullName
                };
            }
        }

    }
}

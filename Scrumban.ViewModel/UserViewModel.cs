using System;
using System.Collections.Generic;
using System.Linq;
using Scrumban.Model;

namespace Scrumban.ViewModel {

    public class UserViewModel {

        public Guid Id { get; set; }

        public string Username { get; set; }

        public string Password { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Role { get; set; }

        public string Token { get; set; }

        public string FullName { get; set; }

        public List<ProjectViewModel> OwnedProjects { get; set; }

        public List<ProjectViewModel> Projects { get; set; }

        public List<TaskViewModel> Tasks { get; set; }

        public UserViewModel() {

        }

        public UserViewModel(User u) {
            Id = u.Id;
            Username = u.Username;
            FirstName = u.FirstName;
            LastName = u.LastName;
            FullName = u.FullName;
            Role = u.Role;
            OwnedProjects = u.OwnedProjects
                .Select(p => new ProjectViewModel {
                    Id = p.Id,
                    Name = p.Name
                }).ToList();
            Projects = u.ProjectsUsers
                .Select(pu => pu.Project)
                .Select(p => new ProjectViewModel {
                    Id = p.Id,
                    Name = p.Name
                }).ToList();
            Tasks = u.Tasks
                .Select(t => new TaskViewModel {
                    Id = t.Id,
                    Name = t.Name,
                    Project = new ProjectViewModel {
                        Id = t.Project.Id,
                        Name = t.Project.Name
                    }
                }).ToList();

        }

    }
}

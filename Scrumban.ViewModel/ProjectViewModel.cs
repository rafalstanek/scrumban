using System;
using System.Collections.Generic;
using System.Linq;
using Scrumban.Model;

namespace Scrumban.ViewModel {

    public class ProjectViewModel {

        public Guid Id { get; set; }

        public string Name { get; set; }

        public bool Finished { get; set; }

        public UserViewModel Owner { get; set; }

        public List<UserViewModel> Users { get; set; }

        public List<TaskViewModel> Tasks { get; set; }

        public List<MessageViewModel> Messages { get; set; }

        public ProjectViewModel() {

        }

        public ProjectViewModel(Project p) {
            Id = p.Id;
            Name = p.Name;
            Finished = p.Finished;
            Owner = new UserViewModel {
                Id = p.Owner.Id,
                FullName = p.Owner.FullName
            };
            Users = p.ProjectUsers
                .Select(pu => pu.User)
                .Select(u => new UserViewModel {
                    Id = u.Id,
                    FullName = u.FullName
                }).ToList();
            Tasks = p.Tasks
                .Select(t => new TaskViewModel {
                    Id = t.Id,
                    Name = t.Name
                }).ToList();
            Messages = p.Messages
                .Select(m => new MessageViewModel {
                    SendDateTime = m.SendDateTime,
                    Text = m.Text,
                    Sender = new UserViewModel {
                        Id = m.Sender.Id,
                        FullName = m.Sender.FullName
                    }
                }).ToList();
        }

    }

}

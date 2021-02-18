using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Scrumban.Model;
using Scrumban.RepositoryInterface;
using Scrumban.ServiceInterface;
using Scrumban.ViewModel;

namespace Scrumban.Service {
    public class ProjectService : IProjectService {
        private readonly IProjectRepository projectRepository;
        private readonly IUserRepository userRepository;
        private readonly IProjectUserRepository projectUserRepository;
        private readonly ITaskRepository taskRepository;

        public ProjectService(IProjectRepository _projectRepository,
            IUserRepository _userRepository,
            ITaskRepository _taskRepository,
            IProjectUserRepository _projectUserRepository) {
            projectRepository = _projectRepository;
            userRepository = _userRepository;
            projectUserRepository = _projectUserRepository;
            taskRepository = _taskRepository;
        }

        public async Task<UserViewModel> AddUser(ProjectUserViewModel viewModel) {
            var dbProject = await projectRepository.FindAsync(viewModel.ProjectId);
            var dbUser = await userRepository.FindAsync(viewModel.UserId);
            if (dbProject != null && dbUser != null) {
                var projectUser = new ProjectUser {
                    ProjectId = dbProject.Id,
                    UserId = dbUser.Id,
                };

                if (await projectUserRepository.CreateAsync(projectUser)) {
                    return new UserViewModel {
                        Id = dbUser.Id,
                        FirstName = dbUser.FirstName,
                        LastName = dbUser.LastName
                    };
                }
            }
            return null;
        }

        public async Task<UserViewModel> DeleteUser(ProjectUserViewModel viewModel) {
            var dbProject = await projectRepository.FindAsync(viewModel.ProjectId);
            var dbUser = await userRepository.FindAsync(viewModel.UserId);
            if (dbProject != null && dbUser != null) {
                var temp = (await projectUserRepository.FindAll()).FirstOrDefault(x => x.UserId == dbUser.Id && x.ProjectId == dbProject.Id);
                if (temp != null) {
                    if (await projectUserRepository.DeleteAsync(temp)) {
                        return new UserViewModel {
                            Id = dbUser.Id,
                            FirstName = dbUser.FirstName,
                            LastName = dbUser.LastName
                        };
                    }

                }
            }
            return null;
        }

        public async Task<ProjectViewModel> Create(ProjectViewModel model) {
            var user = await userRepository.FindByUsernameAsync(model.Owner.Username);
            if (user != null) {
                var project = new Project {
                    Name = model.Name,
                    Finished = false,
                    OwnerId = user.Id
                };

                var result = await projectRepository.CreateAsync(project);

                if (result) {
                    var projectUser = new ProjectUser
                    {
                        ProjectId = project.Id,
                        UserId = project.OwnerId,
                    };
                    var resultProjectUser = await projectUserRepository.CreateAsync(projectUser);

                    if(resultProjectUser)
                        return new ProjectViewModel {
                            Id = project.Id,
                            Name = project.Name,
                            Finished = project.Finished,
                            Owner = new UserViewModel {
                                Id = project.OwnerId
                            }
                        };                
                }
            }
            return null;
        }
        public async Task<bool> Delete(string id) {
            var gid = Guid.Parse(id);
            var project = await projectRepository
                .Queryable()
                .Include(p => p.ProjectUsers)
                .Include(p => p.Tasks)
                .FirstOrDefaultAsync(p => p.Id.Equals(gid));
            var pus = project.ProjectUsers.ToArray();
            for (var i = 0; i < pus.Length; i++) {
                await projectUserRepository.DeleteAsync(pus[i]);
            }
            var tasks = project.Tasks.ToArray();
            for (var i = 0; i < tasks.Length; i++) {
                await taskRepository.DeleteAsync(tasks[i]);
            }


            return await projectRepository.DeleteAsync(project);
        }

        public async Task<ProjectViewModel> GetDetails(string id) {
            var gid = Guid.Parse(id);
            var project = await projectRepository
                .Queryable()
                .Include(p => p.Tasks)
                .Include(p => p.ProjectUsers)
                .Include(p => p.Owner)
                .Include(p => p.Messages)
                .FirstOrDefaultAsync(p => p.Id == gid);
            if (project != null) {
                var users = project.ProjectUsers.Select(p => userRepository.Find(p.UserId)).ToList();

                return new ProjectViewModel {
                    Id = project.Id,
                    Finished = project.Finished,
                    Name = project.Name,
                    Tasks = project.Tasks
                            .Select(t => new TaskViewModel {
                                Id = t.Id,
                                Name = t.Name,
                                Status = t.Status,
                                UserId = t.UserId.HasValue?t.UserId.Value:Guid.Empty,
                                User = 
                                t.UserId.HasValue?
                                new UserViewModel {
                                    Id = t.UserId.HasValue?t.UserId.Value:Guid.Empty,
                                    FullName = (userRepository.Find(t.UserId.Value)).FullName
                                }:null
                            })
                            .ToList(),
                    Users = users
                    .Select(u => new UserViewModel {
                        Id = u.Id,
                        FullName = u.FullName
                    })
                    .ToList(),
                    Owner = new UserViewModel {
                        Id=project.Owner.Id,
                    },
                    Messages = project.Messages.Select(m => new MessageViewModel {
                        ProjectId = m.ProjectId,
                        SendDateTime = m.SendDateTime,
                        Text = m.Text,
                        SenderId = m.SenderId,
                        Sender = new UserViewModel {
                            FullName = userRepository.Find(m.SenderId).FullName
                        }
                    }).ToList()
                };
            }
            return null;
        }

        public async Task<List<ProjectViewModel>> GetOwnedProjects(string username) {
            var user = await userRepository.FindByUsernameAsync(username);
            var ownedProjects = await projectRepository
                   .GetOwnedProjects(user.Id);
            var sharedProjects = await projectRepository.GetSharedProjects(user.Id);
            var projects = new HashSet<Project>(ownedProjects.Concat(sharedProjects));

            return projects
                .Select(u => new ProjectViewModel {
                    Id = u.Id,
                    Name = u.Name,
                    Finished = u.Finished,
                    Owner = new UserViewModel {
                        Id = u.OwnerId
                    }
                }).ToList();
        }

        public async Task<List<ProjectViewModel>> GetProjects() =>
                    await projectRepository.Queryable()
                    .Include(p => p.Owner)
                        .Select(u => new ProjectViewModel {
                            Id = u.Id,
                            Name = u.Name,
                            Finished = u.Finished,
                            Owner = new UserViewModel {

                            }
                        }).ToListAsync();

        public async Task<ProjectViewModel> Update(ProjectViewModel model) {
            var dbUser = await projectRepository.FindAsync(model.Id);
            if (dbUser != null) {
                dbUser.Name = model.Name;
                dbUser.Finished = model.Finished;
                dbUser.OwnerId = model.Owner.Id;

                if (await projectRepository.UpdateAsync(dbUser)) {
                    return model;
                }
            }
            return null;
        }
    }
}

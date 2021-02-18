using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Scrumban.Model;
using Scrumban.RepositoryInterface;
using Scrumban.ServiceInterface;
using Scrumban.ViewModel;

namespace Scrumban.MockService {
    public class MockProjectService : IProjectService {

        private readonly IProjectRepository projectRepository;
        private readonly IUserRepository userRepository;
        private readonly ITaskRepository taskRepository;

        public MockProjectService(IProjectRepository _projectRepository, IUserRepository _userRepository,
            ITaskRepository _taskRepository) {
            projectRepository = _projectRepository;
            userRepository = _userRepository;
            taskRepository = _taskRepository;
        }

        public Task<ProjectViewModel> AddUser(Guid projectId, Guid userId, ProjectViewModel model) => throw new NotImplementedException();

        public async Task<ProjectViewModel> Create(ProjectViewModel model) {
            var user = await userRepository.FindByUsernameAsync(model.Owner.Username);
            if (user != null) {
                var project = new Project {
                    Id = Guid.NewGuid(),
                    Finished = model.Finished,
                    Name = model.Name,
                    OwnerId = user.Id
                };

                var result = await projectRepository.CreateAsync(project);

                if (result) {
                    return new ProjectViewModel {
                        Id = project.Id,
                        Finished = project.Finished,
                        Name = project.Name
                    };
                }
            }
            return null;
        }

        public async Task<bool> Delete(string id) {
            var gid = Guid.Parse(id);
            var project = await projectRepository.FindAsync(gid);
            return await projectRepository.DeleteAsync(project);
        }

        public async Task<ProjectViewModel> GetDetails(string id) {
            var project = await projectRepository.FindAsync(Guid.Parse(id));
            if (project != null) {
                return new ProjectViewModel {
                    Id = project.Id,
                    Finished = project.Finished,
                    Name = project.Name,
                    Tasks =
                      (await System.Threading.Tasks.Task.Run(
                        async () => await taskRepository.FindAll()))
                        .Where(t => t.ProjectId == project.Id)
                        .Select(t => new TaskViewModel {
                            Id = t.Id,
                            Name = t.Name,
                            Status = t.Status
                        })
                        .ToList(),
                    Users = (await System.Threading.Tasks.Task.Run(async () => await userRepository.FindAll()))
                        .Select(u => new UserViewModel {
                            Id = u.Id,
                            FullName = u.FullName
                        })
                        .ToList()
                };
            }
            return null;
        }

        public Task<List<ProjectViewModel>> GetOwnedProjects(string username) => throw new NotImplementedException();

        public async Task<List<ProjectViewModel>> GetProjects() =>
            await System.Threading.Tasks.Task.Run(
                async () => (await projectRepository.FindAll())
            .Select(p => new ProjectViewModel {
                Id = p.Id,
                Finished = p.Finished,
                Name = p.Name,
                Owner = new UserViewModel {
                    Id = p.OwnerId,
                    FullName = p.Owner.FullName
                }
            }).ToList());

        public async Task<ProjectViewModel> Update(ProjectViewModel model) {
            var project = await projectRepository.FindAsync(model.Id);
            if (project != null) {
                project.Name = model.Name;
            }

            if (await projectRepository.UpdateAsync(project)) {
                return model;
            }
            return null;
        }

    }
}

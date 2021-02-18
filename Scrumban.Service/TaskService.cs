using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Scrumban.RepositoryInterface;
using Scrumban.ServiceInterface;
using Scrumban.ViewModel;

namespace Scrumban.Service {
    public class TaskService : ITaskService {
        private readonly ITaskRepository taskRepository;
        private readonly IProjectRepository projectRepository;
        private readonly IUserRepository userRepository;

        public TaskService(ITaskRepository _taskRepository,
            IUserRepository _userRepository,
            IProjectRepository _projectRepository) {
            taskRepository = _taskRepository;
            projectRepository = _projectRepository;
            userRepository = _userRepository;
        }

        public async Task<TaskViewModel> Create(TaskViewModel model) {
            var project = await projectRepository.FindAsync(model.Project.Id);
            if (project != null) {
                var task = new Model.Task {
                    Name = model.Name,
                    ProjectId = project.Id,
                    Status = model.Status
                };
                if (await taskRepository.CreateAsync(task)) {
                    return new TaskViewModel {
                        Id = task.Id,
                        Name = task.Name,
                        Status = task.Status
                    };
                }
            }
            return null;
        }

        public Task<bool> Delete(string id) => throw new NotImplementedException();
        public Task<TaskViewModel> SetUser(Guid taskId, Guid userId) => throw new NotImplementedException();

        public async Task<TaskViewModel> Update(TaskViewModel model) {
            var task = await taskRepository.FindAsync(model.Id);
            if (task != null) {
                task.Name = model.Name;
                task.Status = model.Status;
                if (await taskRepository.UpdateAsync(task)) {
                    return model;
                }
            }
            return null;
        }

        public async Task<TaskViewModel> Select(TaskViewModel model) {
            var task = await taskRepository.FindAsync(model.Id);
            if (task != null) {
                task.UserId = model.UserId;
                var user = await userRepository.FindAsync(model.UserId);
                if (user != null) {
                    if (await taskRepository.UpdateAsync(task)) {
                        return new TaskViewModel {
                            Id = task.Id,
                            Name = task.Name,
                            Status = task.Status,
                            UserId = task.UserId.HasValue ? task.UserId.Value : Guid.Empty,
                            User = new UserViewModel {
                                Id = user.Id,
                                FullName = user.FullName
                            }
                        };
                    }
                }
            }
            return null;
        }

        public async Task<TaskViewModel> Deselect(string id) {
            var task = await taskRepository.FindAsync(Guid.Parse(id));
            if (task != null) {
                task.UserId = null;
                if (await taskRepository.UpdateAsync(task)) {
                    return new TaskViewModel {
                        Id = task.Id,
                        Name = task.Name,
                        Status = task.Status,
                        UserId = task.UserId ?? Guid.Empty,
                    };
                }

            }
            return null;
        }

    }
}

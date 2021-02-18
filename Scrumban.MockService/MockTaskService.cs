using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Scrumban.RepositoryInterface;
using Scrumban.ServiceInterface;
using Scrumban.ViewModel;

namespace Scrumban.MockService {
    public class MockTaskService : ITaskService {

        private readonly ITaskRepository taskRepository;
        private readonly IProjectRepository projectRepository;

        public MockTaskService(ITaskRepository _taskRepository, IProjectRepository _projectRepository) {
            taskRepository = _taskRepository;
            projectRepository = _projectRepository;
        }

        public async Task<TaskViewModel> Create(TaskViewModel model) {
            var project = await projectRepository.FindAsync(model.Project.Id);
            if (project != null) {
                var task = new Model.Task {
                    Id = Guid.NewGuid(),
                    Name = model.Name,
                    ProjectId = model.Project.Id,
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

    }
}

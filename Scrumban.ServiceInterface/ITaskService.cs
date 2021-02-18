using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Scrumban.ViewModel;

namespace Scrumban.ServiceInterface {

    public interface ITaskService {

        Task<TaskViewModel> Create(TaskViewModel model);

        Task<TaskViewModel> Update(TaskViewModel model);

        Task<TaskViewModel> Select(TaskViewModel model);

        Task<TaskViewModel> Deselect(string id);

        Task<bool> Delete(string id);

        Task<TaskViewModel> SetUser(Guid taskId, Guid userId);

    }

}

using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Scrumban.ViewModel;

namespace Scrumban.ServiceInterface {

    public interface IProjectService {

        Task<ProjectViewModel> Create(ProjectViewModel model);

        Task<ProjectViewModel> Update(ProjectViewModel model);

        Task<bool> Delete(string id);

        Task<ProjectViewModel> GetDetails(string id);

        Task<UserViewModel> AddUser(ProjectUserViewModel viewModel);

        Task<UserViewModel> DeleteUser(ProjectUserViewModel viewModel);

        Task<List<ProjectViewModel>> GetProjects();

        Task<List<ProjectViewModel>> GetOwnedProjects(string username);

    }

}

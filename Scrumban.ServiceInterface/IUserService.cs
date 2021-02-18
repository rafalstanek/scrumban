using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Scrumban.ViewModel;

namespace Scrumban.ServiceInterface {
    public interface IUserService {

        Task<List<UserViewModel>> GetUsers();

        Task<UserViewModel> Create(UserViewModel user);

        Task<UserViewModel> Update(UserViewModel user);

        Task<UserViewModel> Authenticate(UserViewModel model);

        Task<UserViewModel> ValidateToken(string token);

        Task<bool> Delete(string id);

        Task<UserViewModel> GetDetails(string id);

    }
}

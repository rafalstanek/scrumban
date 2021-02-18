using System;
using System.Threading.Tasks;
using Scrumban.Model;

namespace Scrumban.RepositoryInterface {
    public interface IUserRepository : IRepositoryAsync<User, Guid> {

        Task<User> FindByUsernameAsync(string username);

        Task<User> GetDetails(Guid id);

    }
}

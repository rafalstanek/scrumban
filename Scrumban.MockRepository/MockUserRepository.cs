using System;
using System.Threading.Tasks;
using Scrumban.Model;
using Scrumban.RepositoryInterface;

namespace Scrumban.MockRepository {

    public class MockUserRepository : MockRepositoryAsync<User, Guid>, IUserRepository {

        public MockUserRepository() {

        }

        public async Task<User> FindByUsernameAsync(string username)
            => await System.Threading.Tasks.Task.Run(() => Objects.Find(u => u.Username == username));

        public Task<User> GetDetails(Guid id) => throw new NotImplementedException();

    }

}

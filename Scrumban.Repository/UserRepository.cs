using System;
using System.Threading.Tasks;
using Scrumban.Data;
using Scrumban.Model;
using Scrumban.RepositoryInterface;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Scrumban.Exceptions;

namespace Scrumban.Repository {

    public class UserRepository : RepositoryAsync<User, Guid>, IUserRepository {
        public UserRepository(ScrumbanContext _context) : base(_context) {
        }

        public override async Task<bool> CreateAsync(User user) {
            try {
                return await base.CreateAsync(user);
            }
            catch (DbUpdateException dbEx) {
                var sqlEx = dbEx.InnerException as SqlException;
                if (sqlEx != null) {
                    if (sqlEx.Number == 2627) {
                        throw new UsernameTakenException("Username already taken", dbEx);
                    }
                }
                throw;
            }
        }

        public override async Task<bool> UpdateAsync(User t) {
            try {
                return await base.UpdateAsync(t);
            }
            catch (DbUpdateException dbEx) {
                var sqlEx = dbEx.InnerException as SqlException;
                if (sqlEx != null) {
                    if (sqlEx.Number == 2627) {
                        throw new UsernameTakenException("Username already taken", dbEx);
                    }
                }
                throw;
            }
        }

        public async Task<User> FindByUsernameAsync(string username) =>
            await dbSet.FirstOrDefaultAsync(user => user.Username == username);
        public Task<User> GetDetails(Guid id) => throw new NotImplementedException();
    }

}

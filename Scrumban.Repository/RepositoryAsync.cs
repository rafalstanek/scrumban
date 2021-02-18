using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Scrumban.Data;
using Scrumban.RepositoryInterface;

namespace Scrumban.Repository {
    public class RepositoryAsync<T, K> : Repository<T, K>, IRepositoryAsync<T, K> where T : class {

        public RepositoryAsync(ScrumbanContext _context) : base(_context) {

        }

        public virtual async Task<bool> CreateAsync(T t) {
            dbSet.Add(t);
            return await context.SaveChangesAsync() != 0;
        }

        public async Task<bool> DeleteAsync(T t) {
            dbSet.Remove(t);
            return await context.SaveChangesAsync() != 0;
        }

        public async Task<List<T>> FindAll() => await dbSet.ToListAsync();

        public async Task<T> FindAsync(K k) => await dbSet.FindAsync(k);

        public virtual async Task<bool> UpdateAsync(T t) {
            dbSet.Update(t);
            return await context.SaveChangesAsync() != 0;
        }

    }
}

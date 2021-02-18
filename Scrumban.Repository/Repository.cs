using System.Linq;
using Microsoft.EntityFrameworkCore;
using Scrumban.Data;
using Scrumban.RepositoryInterface;

namespace Scrumban.Repository {
    public class Repository<T, K> : IRepository<T, K> where T : class {
        protected readonly ScrumbanContext context;
        protected readonly DbSet<T> dbSet;

        public Repository(ScrumbanContext _context) {
            context = _context;
            dbSet = _context.Set<T>();
        }

        public bool Create(T t) {
            dbSet.Add(t);
            return context.SaveChanges() != 0;
        }

        public bool Delete(T t) {
            dbSet.Remove(t);
            return context.SaveChanges() != 0;
        }

        public T Find(K k) => dbSet.Find(k);

        public IQueryable<T> Queryable() => dbSet;

        public bool Update(T t) {
            dbSet.Update(t);
            return context.SaveChanges() != 0;
        }

    }
}

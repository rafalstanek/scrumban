using System;
using System.Linq;

namespace Scrumban.RepositoryInterface {
    public interface IRepository<T, K> {
        bool Create(T t);

        T Find(K k);

        bool Update(T t);

        bool Delete(T t);

        IQueryable<T> Queryable();

    }
}

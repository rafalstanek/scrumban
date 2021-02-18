using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Scrumban.RepositoryInterface {
    public interface IRepositoryAsync<T, K> : IRepository<T, K> {
        Task<bool> CreateAsync(T t);

        Task<T> FindAsync(K k);

        Task<bool> UpdateAsync(T t);

        Task<bool> DeleteAsync(T t);

        Task<List<T>> FindAll();

    }
}

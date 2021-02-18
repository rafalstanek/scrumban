using System.Collections.Generic;
using System.Threading.Tasks;
using Scrumban.RepositoryInterface;

namespace Scrumban.MockRepository {

    public class MockRepositoryAsync<T, K> : MockRepository<T, K>, IRepositoryAsync<T, K> {

        public MockRepositoryAsync() {

        }

        public async Task<bool> CreateAsync(T t) => await Task.Run(() => Create(t));

        public async Task<bool> DeleteAsync(T t) => await Task.Run(() => Delete(t));

        public async Task<List<T>> FindAll() => await Task.Run(() => Objects);

        public async Task<T> FindAsync(K k) => await Task.Run(() => Find(k));

        public async Task<bool> UpdateAsync(T t) => await Task.Run(() => Update(t));

    }

}

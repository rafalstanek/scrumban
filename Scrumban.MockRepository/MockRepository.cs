using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Scrumban.RepositoryInterface;

namespace Scrumban.MockRepository {

    public class MockRepository<T, K> : IRepository<T, K> {

        protected List<T> Objects { get; set; } = new List<T>();

        private static readonly PropertyInfo idProperty = typeof(T).GetProperty("Id");

        private readonly Func<T, K> GetId = (T t) => (K)idProperty.GetValue(t);

        public MockRepository() {

        }

        public bool Create(T t) {
            var count = Objects.Count;
            Objects.Add(t);
            return Objects.Count == count + 1;
        }

        public bool Delete(T t) {
            var count = Objects.Count;
            Objects.Remove(t);
            return Objects.Count == count - 1;
        }

        public T Find(K k) => Objects.Find(t => GetId(t).Equals(k));

        public IQueryable<T> Queryable() => Objects.AsQueryable();

        public bool Update(T t) {
            var id = GetId(t);
            for (var i = Objects.Count - 1; i >= 0; i--) {
                if (GetId(Objects[i]).Equals(id)) {
                    Objects[i] = t;
                    return true;
                }
            }
            return false;
        }

    }

}

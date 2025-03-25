using System.Linq.Expressions;

namespace back_end.Common.GenericRespository
{
    public interface IBaseRespository<T> where T : class
    {
        Task Insert(T entity);
        Task Insert(IEnumerable<T> entities);
        Task<IEnumerable<T>> GetQuery(Expression<Func<T, bool>> express = null);
        Task Update(T entity);
        Task Update(IEnumerable<T> entities);
        Task Delete(T entity);
        Task Delete(IEnumerable<T> entity);
        IQueryable<T> Queryable();
    }
}

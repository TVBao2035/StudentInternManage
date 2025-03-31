using back_end.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using System.Linq.Expressions;

namespace back_end.Common.GenericRespository
{
    public class BaseRespository<T> : IDisposable, IBaseRespository<T> where T : class
    {
        private ApplicationDBContext _context;
        private DbSet<T> _entities;
        private bool disposedValue;
        
        public BaseRespository(ApplicationDBContext context)
        {
            _context = context;
            _entities = context.Set<T>();
        }
       
        public IQueryable<T> FindBy(Expression<Func<T, bool>> expression)
        {
            try
            {
                return _context.Set<T>().Where(expression).AsQueryable<T>();
            }
            catch (Exception)
            {

                throw;
            }
        }
       
        public async Task<IEnumerable<T>> GetQuery(Expression<Func<T, bool>> express = null)
        {
            if (express is null)
            {
                return await _context.Set<T>().ToListAsync();
            }

            return await _context.Set<T>().Where(express).ToListAsync();
        }
     
        public IQueryable<T> Queryable()
        {
            return _context.Set<T>();
        }
    
        public async Task Delete(T entity)
        {
            try
            {
                _context.Set<T>().Remove(entity);
                await _context.SaveChangesAsync();
            }
            catch (Exception)
            {

                throw;
            }
        }
      
        public async Task Delete(IEnumerable<T> entities)
        {
            try
            {
                _context.Set<T>().RemoveRange(entities);
                await _context.SaveChangesAsync();
            }
            catch (Exception)
            {

                throw;
            }
        }
       
        public async Task Insert(T entity)
        {
            try
            {
                await _context.Set<T>().AddAsync(entity);
                 _context.SaveChanges();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task Insert(IEnumerable<T> entities)
        {
            try
            {
                await _context.Set<T>().AddRangeAsync(entities);
                await _context.SaveChangesAsync();
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task Update(T entity)
        {
            try
            {
                if (entity != null)
                {
                    _context.Set<T>().Update(entity);
                    await _context.SaveChangesAsync();
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task Update(IEnumerable<T> entities)
        {
            try
            {
                _context.Set<T>().UpdateRange(entities);
                await _context.SaveChangesAsync();
            }
            catch (Exception)
            {

                throw;
            }
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!disposedValue)
            {
                if (disposing)
                {
                    _context.Dispose();
                }

                // TODO: free unmanaged resources (unmanaged objects) and override finalizer
                // TODO: set large fields to null
                disposedValue = true;
            }
        }

        // // TODO: override finalizer only if 'Dispose(bool disposing)' has code to free unmanaged resources
        // ~BaseRespository()
        // {
        //     // Do not change this code. Put cleanup code in 'Dispose(bool disposing)' method
        //     Dispose(disposing: false);
        // }

        public void Dispose()
        {
            // Do not change this code. Put cleanup code in 'Dispose(bool disposing)' method
            Dispose(disposing: true);
            GC.SuppressFinalize(this);
        }

        
    }
}

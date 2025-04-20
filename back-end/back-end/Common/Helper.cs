using back_end.Enity;
using back_end.Respositories.Interface;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Globalization;
using System.Security.Claims;

namespace back_end.Common
{
    public class Helper
    {
        private static IUserRespository _userRespository;
        private static IHttpContextAccessor _contextAccessor;

        public Helper(IHttpContextAccessor contextAccessor, IUserRespository userRespository)
        {
            _userRespository = userRespository;
            _contextAccessor = contextAccessor;
        }
        public static DateTime FormatDate(DateTime date)
        {
            return DateTime.ParseExact(
                    date.ToShortDateString().ToString(),
                    "dd/MM/yyyy",
                    CultureInfo.InvariantCulture
                );
        
        }

        public static string FormatDate(string date)
        {
            return DateTime.ParseExact(date, "dd/MM/yyyy", CultureInfo.InvariantCulture).ToString("dd/MM/yyyy");
        }

        

        
    }
}

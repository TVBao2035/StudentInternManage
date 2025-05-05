using back_end.Enity;
using back_end.Respositories.Interface;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Globalization;
using System.Security.Claims;
using System.Text.RegularExpressions;

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

        public static string GetNowDateString()
        {
            return DateTime.UtcNow.ToString("dd/MM/yyyy");
        }

        public static bool ValidateEmail(string email)
        {
            var trimmedEmail = email.Trim();

            if (trimmedEmail.EndsWith("."))
            {
                return false;
            }
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == trimmedEmail;
            }
            catch
            {
                return false;
            }
        }

        public static bool IsPhoneNumber(string number)
        {
            return Regex.Match(number, @"^(0[0-9]{9})$").Success;
        }
        
        public static DateTime FormatDate(DateTime date)
        {

            return DateTime.ParseExact(
                    date.ToString("dd/MM/yyyy"),
                    //date.ToShortDateString().ToString(),
                    "dd/MM/yyyy",
                    CultureInfo.InvariantCulture
                );
        
        }

        public static string FormatDate(string date)
        {
            if (date is null || date.Trim().Length == 0) return null;
            return DateTime.ParseExact(date, "dd/MM/yyyy", CultureInfo.InvariantCulture).ToString("dd/MM/yyyy");
        }

        

        
    }
}
